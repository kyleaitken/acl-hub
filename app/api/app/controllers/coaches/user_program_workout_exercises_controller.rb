class Coaches::UserProgramWorkoutExercisesController < ApplicationController
    before_action -> { doorkeeper_authorize! :coach }
    before_action :set_user_program_workout
    before_action :authorize_coach_for_user

    # GET /coaches/users/:user_id/user_programs/:user_program_id/user_program_workouts/:user_program_workout_id/user_program_workout_exercises
    def index
        @user_program_workout_exercises = @user_program_workout.user_program_workout_exercises.includes(:exercise)
        render json: @user_program_workout_exercises.as_json(include: :exercise)
    end
    
    # GET /coaches/users/:user_id/user_programs/:user_program_id/user_program_workouts/:user_program_workout_id/user_program_workout_exercises/:id
    def show    
        @user_program_workout_exercise = @user_program_workout.user_program_workout_exercises.find(params[:id])
        render json: @user_program_workout_exercise.as_json(include: :exercise)
    end

    # POST /coaches/users/:user_id/user_programs/:user_program_id/user_program_workouts/:user_program_workout_id/user_program_workout_exercises
    def create
        @user_program_workout_exercise = @user_program_workout.user_program_workout_exercises.build(user_program_workout_exercise_params)
        if @user_program_workout_exercise.save
            render json: @user_program_workout_exercise.as_json(include: :exercise), status: :created
        else
            render json: @user_program_workout_exercise.errors, status: :unprocessable_entity
        end
    end

    # PUT /coaches/users/:user_id/user_programs/:user_program_id/user_program_workouts/:user_program_workout_id/user_program_workout_exercises/:id
    def update
        @user_program_workout_exercise = @user_program_workout.user_program_workout_exercises.find(params[:id])
        if @user_program_workout_exercise.update(user_program_workout_exercise_params)
            render json: @user_program_workout_exercise.as_json(include: :exercise)
        else
            render json: @user_program_workout_exercise.errors, status: :unprocessable_entity
        end
    end

    # DELETE /coaches/users/:user_id/user_programs/:user_program_id/user_program_workouts/:user_program_workout_id/user_program_workout_exercises/:id
    def destroy
        @user_program_workout_exercise = @user_program_workout.user_program_workout_exercises.find(params[:id])
        @user_program_workout_exercise.destroy
        render json: { message: "User program workout exercise deleted successfully" }, status: :ok    
    end

    private 

    def set_user_program_workout
        @user = User.find(params[:user_id])
        @user_program = @user.user_programs.find(params[:user_program_id])
        @user_program_workout = @user_program.user_program_workouts.find(params[:user_program_workout_id])
    rescue ActiveRecord::RecordNotFound
        render json: { error: 'Resource not found' }, status: :not_found
    end
    
    def user_program_workout_exercise_params
        params.require(:user_program_workout_exercise).permit(:exercise_id, :order, :instructions, :sets, :reps, :weight, :duration, :hold, :completed, :results)
    end

    def authorize_coach_for_user
        unless @user.coach == current_coach
          render json: { error: 'You are not authorized to access this user\'s programs' }, status: :forbidden
        end
    end
end
