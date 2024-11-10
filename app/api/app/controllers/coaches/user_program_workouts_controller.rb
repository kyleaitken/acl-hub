class Coaches::UserProgramWorkoutsController < ApplicationController
    before_action -> { doorkeeper_authorize! :coach }
    before_action :set_user_program
    before_action :authorize_coach_for_user

    # GET /coaches/users/:user_id/user_programs/:user_program_id/user_program_workouts
    def index
        @user_program_workouts = @user_program.user_program_workouts
        render json: @user_program_workouts
    end
    
    # GET /coaches/users/:user_id/user_programs/:user_program_id/user_program_workouts/:id
    def show    
        @user_program_workout = @user_program.user_program_workouts.find(params[:id])
        render json: @user_program_workout
    end

    # POST /coaches/users/:user_id/user_programs/:user_program_id/user_program_workouts
    def create
        @user_program_workout = @user_program.user_program_workouts.build(user_program_workout_params)
        if @user_program_workout.save
            render json: @user_program_workout, status: :created
        else
            render json: @user_program_workout.errors, status: :unprocessable_entity
        end
    end

    # PUT /coaches/users/:user_id/user_programs/:user_program_id/user_program_workouts/:id
    def update
        @user_program_workout = @user_program.user_program_workouts.find(params[:id])
        if @user_program_workout.update(user_program_workout_params)
            render json: @user_program_workout
        else
            render json: @user_program_workout.errors, status: :unprocessable_entity
        end
    end

    # DELETE /coaches/users/:user_id/user_programs/:user_program_id/user_program_workouts/:id
    def destroy
        @user_program_workout = @user_program.user_program_workouts.find(params[:id])
        @user_program_workout.destroy
        render json: { message: "User program workout deleted successfully" }, status: :ok    
    end

    private 

    def set_user_program
        @user = User.find(params[:user_id])
        @user_program = @user.user_programs.find(params[:user_program_id])
    end

    def user_program_workout_params
        params.require(:user_program_workout).permit(:date, :day, :week, :comment, :completed, :order)
    end

    def authorize_coach_for_user
        unless @user.coach == current_coach
          render json: { error: 'You are not authorized to access this user\'s programs' }, status: :forbidden
        end
    end
end
