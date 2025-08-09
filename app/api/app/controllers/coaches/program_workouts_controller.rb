module Coaches
    class ProgramWorkoutsController < ApplicationController
        before_action -> { doorkeeper_authorize! :coach }
        before_action :set_program 

        Service = Coaches::ProgramWorkouts 

        # GET /coaches/programs/:program_id/program_workouts
        def index
          workouts = @program
                     .program_workouts
                     .includes(:program_workout_exercises, :warmup, :cooldown)
    
          render json: workouts.map { |w| ProgramWorkoutSerializer.serialize(w) }
        end
        
        # GET /coaches/programs/:program_id/program_workouts/:id
        def show
          workout = @program.program_workouts.find(params[:id])
          render json: ProgramWorkoutSerializer.serialize(workout)
        end

        # POST coaches/programs/:program_id/program_workouts
        def create
          result = Service::CreateProgramWorkout.call(current_coach, @program, scrubbed_params)

          if result[:success]
            render json: ProgramWorkoutSerializer.serialize(result[:workout]), status: :created
          else
            render json: { errors: result[:errors] }, status: :unprocessable_entity
          end
        end

        # POST /coaches/programs/:program_id/program_workouts/copy_workouts
        def copy_workouts
          result = Service::CopyProgramWorkouts.call(current_coach, @program, copy_params)

          if result[:success]
            render json: result[:payload], status: :created
          else
            render json: { errors: result[:errors] }, status: :unprocessable_entity
          end
        end

        # PATCH/PUT coaches/programs/:program_id/program_workouts/:id
        def update
          result = Service::UpdateProgramWorkout.call(current_coach, @program, params[:id], scrubbed_params)

          if result[:success]
            render json: ProgramWorkoutSerializer.serialize(result[:workout]), status: :ok
          else
            return render json: { errors: result.errors }, status: :unprocessable_entity
          end
        end

        # DELETE coaches/programs/:program_id/program_workouts/
        def destroy
          @program.program_workouts.find(params[:id]).destroy
          head :no_content
        end

        # DELETE /coaches/programs/:program_id/program_workouts/destroy_multiple
        def destroy_multiple
          @program.program_workouts.where(id: Array(params[:ids])).destroy_all
          head :no_content
        end

        private
      
        def set_program
            @program = Program.find(params[:program_id])
        end

        def copy_params
          params.permit(:target_week, :target_day, workout_ids: [])
        end

        def raw_params
          params.require(:program_workout).permit(
            :name, :day, :week, :order,
            :warmup_id, :cooldown_id,
            warmup_attributes: [:id, :name, :instructions, :custom, exercise_ids: []],
            cooldown_attributes: [:id, :name, :instructions, :custom, exercise_ids: []],
            program_workout_exercises_attributes: [
              :id, :exercise_id, :order, :instructions, :_destroy,
              exercise_attributes: [:id, :name, :description, :video_url, :custom]
            ]
          )
        end
        
        def scrubbed_params
          p = raw_params.to_h

          if p["warmup_id"].blank? && wa = p.delete("warmup_attributes")
            # Creating a new custom warmup only if no warmup_id is given
            wa["custom"] = true
            wa["coach_id"] = current_coach.id
            p["warmup_attributes"] = wa
          end
          # else if warmup_id present, leave it untouched so it references existing routine
          
          if p["cooldown_id"].blank? && ca = p.delete("cooldown_attributes")
            ca["custom"] = true
            ca["coach_id"] = current_coach.id
            p["cooldown_attributes"] = ca
          end
        
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