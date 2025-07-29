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

        def set_program
            @program = Program.find(params[:program_id])
        end

        # def program_workout_params
        #     params.require(:program_workout).permit(:name, :day, :week, :order, :warmup_id, :cooldown_id)
        # end

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