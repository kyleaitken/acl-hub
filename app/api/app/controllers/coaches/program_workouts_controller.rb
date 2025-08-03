module Coaches
    class ProgramWorkoutsController < ApplicationController
        before_action -> { doorkeeper_authorize! :coach }
        before_action :set_program 

        # GET /coaches/programs/:program_id/program_workouts
        def index
            @program_workouts = @program.program_workouts.includes(:program_workout_exercises, :warmup, :cooldown)
            render json: @program_workouts.as_json(include: {
                program_workout_exercises: { include: :exercise },
                warmup: { include: :exercises },
                cooldown: { include: :exercises }
            })
        end
        
        # GET /coaches/programs/:program_id/program_workouts/:id
        def show
            @program_workout = @program.program_workouts.includes(:program_workout_exercises, :warmup, :cooldown).find(params[:id])
            render json: detailed_payload(@program_workout)
        end

        # POST coaches/programs/:program_id/program_workouts
        def create
          @program_workout = @program.program_workouts.build(scrubbed_params)

          # pick up any nested warmup/cooldown…
          if @program_workout.warmup&.custom?
            @program_workout.warmup.coach = current_coach
          end

          if @program_workout.cooldown&.custom?
            @program_workout.cooldown.coach = current_coach
          end

          if @program_workout.save
            render json: detailed_payload(@program_workout), status: :created
          else
            render json: { errors: @program_workout.errors.full_messages },
                   status: :unprocessable_entity
          end
        end

        def copy_workouts
          program     = Program.find(params[:program_id])
          source      = fetch_source_workouts(program)
          base_day    = day_of_program(source.first)
          new_workouts = []
        
          ProgramWorkout.transaction do
            source.each do |orig|
              offset       = day_of_program(orig) - base_day
              new_week, new_day = map_to_target_week_day(offset)
        
              clone = build_clone(orig, new_week, new_day, program)
              duplicate_exercises(orig, clone)
              new_workouts << clone
            end
    
            # bump num_weeks if necessary
            max_copied_week = new_workouts.map(&:week).max
            if max_copied_week > program.num_weeks
              program.update!(num_weeks: max_copied_week)
            end
          end
        
          render json: {
            program: {
              id:          program.id,
              num_weeks:   program.num_weeks
            },
            workouts: new_workouts.map { |w| detailed_payload(w) }
          }, status: :created
        end

        # PATCH/PUT coaches/programs/:program_id/program_workouts/:id
        def update
          @program_workout = @program.program_workouts.find(params[:id])
          if @program_workout.update(scrubbed_params)
            render json: @program_workout, status: :ok
          else
            render json: { errors: @program_workout.errors.full_messages },
                   status: :unprocessable_entity
          end
        end

        # DELETE coaches/programs/:program_id/program_workouts/
        def destroy
            @program_workout = @program.program_workouts.find(params[:id])
            @program_workout.destroy
            head :no_content
        end

        # DELETE /coaches/programs/:program_id/program_workouts/destroy_multiple
        def destroy_multiple
            ids = params[:ids] || []
            @program.program_workouts.where(id: ids).destroy_all
            head :no_content
        end

        private

        def fetch_source_workouts(program)
          program.program_workouts
                 .where(id: params[:workout_ids])
                 .order(:week, :day, :order)
        end
      
        # “Absolute” day number in the program calendar
        def day_of_program(workout)
          (workout.week - 1) * 7 + workout.day
        end
      
        # Map an offset (in days) onto the target week/day
        def map_to_target_week_day(offset)
          target_index = ((params[:target_week] - 1) * 7 + params[:target_day]) + offset
          # divmod gives zero-based [quotient, remainder]
          week_zero, day_zero = (target_index - 1).divmod(7)
          [ week_zero + 1, day_zero + 1 ]
        end
      
        # Clone the ProgramWorkout record with correct week/day/order
        def build_clone(orig, new_week, new_day, program)
          existing = program.program_workouts
                            .where(week: new_week, day: new_day)
                            .count
      
          clone = orig.dup
          clone.week  = new_week
          clone.day   = new_day
          clone.order = existing
          clone.save!
          clone
        end
      
        # Re-attach each exercise link to the new workout
        def duplicate_exercises(orig, clone)
          orig.program_workout_exercises.find_each do |pwe|
            clone.program_workout_exercises.create!(
              exercise_id:  pwe.exercise_id,
              order:        pwe.order,
              instructions: pwe.instructions
            )
          end
        end

        def set_program
            @program = Program.find(params[:program_id])
        end

        def detailed_payload(workout)
          workout.as_json(
            include: {
              program_workout_exercises: { include: :exercise },
              warmup:  { include: :exercises },
              cooldown: { include: :exercises }
            }
          )
        end

        def raw_params
          params.require(:program_workout).permit(
            :name, :day, :week, :order,
            :warmup_id, :cooldown_id,
        
            warmup_attributes: [
              :id, :name, :instructions, :custom, exercise_ids: []
            ],
            cooldown_attributes: [
              :id, :name, :instructions, :custom, exercise_ids: []
            ],
            program_workout_exercises_attributes: [
              :id, :exercise_id, :order, :instructions, :_destroy,
              exercise_attributes: [:id, :name, :description, :video_url, :custom]
            ]
          )
        end
        
        def scrubbed_params
          p = raw_params.to_h

          if wa = p.delete("warmup_attributes")
            # If they referenced a library warmup, drop its id so we create new
            if wa["id"].present? && !Warmup.find(wa["id"]).custom?
              wa.delete("id")
            end
            wa["custom"] = true
            wa["coach_id"] = current_coach.id
            p["warmup_attributes"] = wa
            p.delete("warmup_id")
          end
        
          if ca = p.delete("cooldown_attributes")
            ca.delete("id") if ca["id"].present? && !Cooldown.find(ca["id"]).custom?
            ca["custom"]     = true
            ca["coach_id"]   = current_coach.id
        
            p["cooldown_attributes"] = ca
            p.delete("cooldown_id")
          end
        
          # 3️⃣ Exercises logic
          if p["program_workout_exercises_attributes"]
            p["program_workout_exercises_attributes"].each do |entry|
              if ea = entry["exercise_attributes"]
                if ea["id"]
                  ex = Exercise.find(ea["id"])
                  # only update existing if it’s custom
                  unless ex.custom?
                    # drop the id so AR builds a new Exercise
                    ea.delete("id")
                    entry.delete("exercise_id")
                  end
                else
                  # new exercise → drop the link
                  entry.delete("exercise_id")
                end
              end
            end
          end
        
          p
        end
        

    end
end