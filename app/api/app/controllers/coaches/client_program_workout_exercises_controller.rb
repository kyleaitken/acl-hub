class Coaches::ClientProgramWorkoutExercisesController < ApplicationController
    before_action -> { doorkeeper_authorize! :coach }
    before_action :set_client_program_workout
    before_action :authorize_coach_for_client

    # GET /coaches/clients/:client_id/client_programs/:client_program_id/client_program_workouts/:client_program_workout_id/client_program_workout_exercises
    def index
        @client_program_workout_exercises = @client_program_workout.client_program_workout_exercises.includes(:exercise)
        render json: @client_program_workout_exercises.as_json(include: :exercise)
    end
    
    # GET /coaches/clients/:client_id/client_programs/:client_program_id/client_program_workouts/:client_program_workout_id/client_program_workout_exercises/:id
    def show    
        @client_program_workout_exercise = @client_program_workout.client_program_workout_exercises.find(params[:id])
        render json: @client_program_workout_exercise.as_json(include: :exercise)
    end

    # POST /coaches/clients/:client_id/client_programs/:client_program_id/client_program_workouts/:client_program_workout_id/client_program_workout_exercises
    def create
        @client_program_workout_exercise = @client_program_workout.client_program_workout_exercises.build(client_program_workout_exercise_params)
        if @client_program_workout_exercise.save
            render json: @client_program_workout_exercise.as_json(include: :exercise), status: :created
        else
            render json: @client_program_workout_exercise.errors, status: :unprocessable_entity
        end
    end

    # PUT /coaches/clients/:client_id/client_programs/:client_program_id/client_program_workouts/:client_program_workout_id/client_program_workout_exercises/:id
    def update
        @client_program_workout_exercise = @client_program_workout.client_program_workout_exercises.find(params[:id])
        if @client_program_workout_exercise.update(client_program_workout_exercise_params)
            render json: @client_program_workout_exercise.as_json(include: :exercise)
        else
            render json: @client_program_workout_exercise.errors, status: :unprocessable_entity
        end
    end

    # DELETE /coaches/clients/:client_id/client_programs/:client_program_id/client_program_workouts/:client_program_workout_id/client_program_workout_exercises/:id
    def destroy
        @client_program_workout_exercise = @client_program_workout.client_program_workout_exercises.find(params[:id])
        @client_program_workout_exercise.destroy
        render json: { message: "Client program workout exercise deleted successfully" }, status: :ok    
    end

    private 

    def set_client_program_workout
        @client = Client.find(params[:client_id])
        @client_program = @client.client_programs.find(params[:client_program_id])
        @client_program_workout = @client_program.client_program_workouts.find(params[:client_program_workout_id])
    rescue ActiveRecord::RecordNotFound
        render json: { error: 'Resource not found' }, status: :not_found
    end
    
    def client_program_workout_exercise_params
        params.require(:client_program_workout_exercise).permit(:exercise_id, :order, :instructions, :sets, :reps, :weight, :duration, :hold, :completed, :results)
    end

    def authorize_coach_for_client
        unless @client.coach == current_coach
          render json: { error: 'You are not authorized to access this client\'s programs' }, status: :forbidden
        end
    end
end
