class Users::UserProgramWorkoutExercisesController < ApplicationController
    before_action -> { doorkeeper_authorize! :user }
    before_action :set_user_program_workout

    # GET /users/user_programs/user_program_id/user_program_workouts/user_program_workout_id/user_program_workout_exercises
    def index
        @user_program_workout_exercises = @user_program_workout.user_program_workout_exercises.includes(:exercise)
        render json: @user_program_workout_exercises.as_json(include: :exercise)
    end

    # GET /users/user_programs/user_program_id/user_program_workouts/user_program_workout_id/user_program_workout_exercises/:id
    def show
        @user_program_workout_exercise = @user_program_workout.user_program_workout_exercises.find(params[:id])
        render json: @user_program_workout_exercise.as_json(include: :exercise)
    end

    # PUT /users/user_programs/user_program_id/user_program_workouts/user_program_workout_id/user_program_workout_exercises/:id
    def update
        @user_program_workout_exercise = @user_program_workout.user_program_workout_exercises.find(params[:id])
        if @user_program_workout_exercise.update(user_program_workout_exercise_params)
            render json: @user_program_workout_exercise
        else
            render json: @user_program_workout_exercise.errors, status: :unprocessable_entity
        end
    end

    # POST /users/user_programs/user_program_id/user_program_workouts/user_program_workout_id/user_program_workout_exercises
    def create
        @user_program_workout_exercise = @user_program_workout.user_program_workout_exercises.build(user_program_workout_exercise_params)
        if @user_program_workout_exercise.save
            render json: @user_program_workout_exercise, status: :created
        else
            render json: @user_program_workout_exercise.errors, status: :unprocessable_entity
        end
    end

    # DELETE /users/user_programs/user_program_id/user_program_workouts/user_program_workout_id/user_program_workout_exercises/:id
    def destroy
        @user_program_workout_exercise = @user_program_workout.user_program_workout_exercises.find(params[:id])
        @user_program_workout_exercise.destroy
        render json: { message: "Deleted successfully" }, status: :ok    
    end
    
    private

    def user_program_workout_exercise_params
        params.require(:user_program_workout_exercise).permit(:exercise_id, :order, :instructions, :sets, :reps, :weight, :duration, :hold, :completed, :results)
    end

    def set_user_program_workout
        @user_program_workout = UserProgramWorkout.find(params[:user_program_workout_id])
    end
end
