module Coaches
    class ProgramWorkoutsController < ApplicationController
        before_action -> { doorkeeper_authorize! :coach }
        # before_action :ensure_current_coach
        before_action :set_program # Still needed to load @program

        # TODO: Update program controller to include warmups and cooldowns
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
            render json: @program_workout.as_json(include: {
                program_workout_exercises: { include: :exercise },
                warmup: { include: :exercises },
                cooldown: { include: :exercises }
            })
        end

        # POST coaches/programs/:program_id/program_workouts
        def create
            @program_workout = @program.program_workouts.build(program_workout_params)
            if @program_workout.save
                render json: @program_workout, status: :created
            else
                render json: @program_workout.errors, status: :unprocessable_entity
            end
        end

        # PATCH/PUT coaches/programs/:program_id/program_workouts/:id
        def update
            @program_workout = @program.program_workouts.find(params[:id])
            if @program_workout.update(program_workout_params)
                render json: @program_workout
            else
                render json: @program_workout.errors, status: :unprocessable_entity
            end
        end

        # DELETE coaches/programs/:program_id/program_workouts/
        def destroy
            @program_workout = @program.program_workouts.find(params[:id])
            @program_workout.destroy
            head :no_content
        end

        private

        def set_program
            @program = Program.find(params[:program_id])
        end

        def program_workout_params
            params.require(:program_workout).permit(:day, :week, :order)
        end
    end
end