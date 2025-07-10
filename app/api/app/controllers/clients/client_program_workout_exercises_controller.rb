class Clients::ClientProgramWorkoutExercisesController < ApplicationController
    before_action -> { doorkeeper_authorize! :client }
    before_action :set_client_program_workout

    # GET /clients/client_programs/client_program_id/client_program_workouts/client_program_workout_id/client_program_workout_exercises
    def index
        @client_program_workout_exercises = @client_program_workout.client_program_workout_exercises.includes(:exercise)
        render json: @client_program_workout_exercises.as_json(include: :exercise)
    end

    # GET /clients/client_programs/client_program_id/client_program_workouts/client_program_workout_id/client_program_workout_exercises/:id
    def show
        @client_program_workout_exercise = @client_program_workout.client_program_workout_exercises.find(params[:id])
        render json: @client_program_workout_exercise.as_json(include: :exercise)
    end

    # PUT /clients/client_programs/client_program_id/client_program_workouts/client_program_workout_id/client_program_workout_exercises/:id
    def update
        @client_program_workout_exercise = @client_program_workout.client_program_workout_exercises.find(params[:id])
        if @client_program_workout_exercise.update(client_program_workout_exercise_params)
            render json: @client_program_workout_exercise
        else
            render json: @client_program_workout_exercise.errors, status: :unprocessable_entity
        end
    end

    # POST /clients/client_programs/client_program_id/client_program_workouts/client_program_workout_id/client_program_workout_exercises
    def create
        @client_program_workout_exercise = @client_program_workout.client_program_workout_exercises.build(client_program_workout_exercise_params)
        if @client_program_workout_exercise.save
            render json: @client_program_workout_exercise, status: :created
        else
            render json: @client_program_workout_exercise.errors, status: :unprocessable_entity
        end
    end

    # DELETE /clients/client_programs/client_program_id/client_program_workouts/client_program_workout_id/client_program_workout_exercises/:id
    def destroy
        @client_program_workout_exercise = @client_program_workout.client_program_workout_exercises.find(params[:id])
        @client_program_workout_exercise.destroy
        render json: { message: "Deleted successfully" }, status: :ok    
    end
    
    private

    def client_program_workout_exercise_params
        params.require(:client_program_workout_exercise).permit(:exercise_id, :order, :instructions, :sets, :reps, :weight, :duration, :hold, :completed, :results)
    end

    def set_client_program_workout
        @client_program_workout = ClientProgramWorkout.find(params[:client_program_workout_id])
    end
end
