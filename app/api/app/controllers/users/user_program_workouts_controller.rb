class Users::UserProgramWorkoutsController < ApplicationController
    before_action -> { doorkeeper_authorize! :user }
    before_action :set_user_program

    # GET /users/user_programs/user_program_id/user_program_workouts
    def index
        @user_program_workouts = @user_program.user_program_workouts
        render json: @user_program_workouts
    end

    # GET /users/user_programs/user_program_id/user_program_workouts/:id
    def show
        @user_program_workout = @user_program.user_program_workouts.find(params[:id])
        render json: @user_program_workout
    end

    # PUT /users/user_programs/user_program_id/user_program_workouts/:id
    def update
        @user_program_workout = @user_program.user_program_workouts.find(params[:id])
        if @user_program_workout.update(user_program_workout_params)
            render json: @user_program_workout
        else
            render json: @user_program_workout.errors, status: :unprocessable_entity
        end
    end

    # POST /users/user_programs/user_program_id/user_program_workouts
    def create
        @user_program_workout = @user_program.user_program_workouts.build(user_program_workout_params)
        if @user_program_workout.save
            render json: @user_program_workout, status: :created
        else
            render json: @user_program_workout.errors, status: :unprocessable_entity
        end
    end

    # DELETE /users/user_programs/user_program_id/user_program_workouts/:id
    def destroy
        @user_program_workout = @user_program.user_program_workouts.find(params[:id])
        @user_program_workout.destroy
        render json: { message: "Deleted successfully" }, status: :ok    
    end
    
    private

    def user_program_workout_params
        params.require(:user_program_workout).permit(:date, :day, :week, :comment, :completed, :order)
    end

    def set_user_program
        @user_program = UserProgram.find(params[:user_program_id])
    end
end
