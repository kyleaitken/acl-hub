class Coaches::UserProgramsController < ApplicationController
    before_action -> { doorkeeper_authorize! :coach }
    before_action :set_user
    before_action :authorize_coach_for_user

    # GET /coaches/users/:user_id/user_programs
    def index
        @user_programs = @user.user_programs
        render json: @user_programs
    end
    
    # GET /coaches/users/:user_id/user_programs/:id
    def show    
        @user_program = @user.user_programs.find(params[:id])
        render json: @user_program
    end

    # POST /coaches/users/:user_id/user_programs
    def create
        @user_program = @user.user_programs.build(user_program_params)
        if @user_program.save
            render json: @user_program, status: :created
        else
            render json: @user_program.errors, status: :unprocessable_entity
        end
    end

    # PUT /coaches/users/:user_id/user_programs/:id
    def update
        @user_program = @user.user_programs.find(params[:id])
        if @user_program.update(user_program_params)
            render json: @user_program
        else
            render json: @user_program.errors, status: :unprocessable_entity
        end
    end

    # DELETE /coaches/users/:user_id/user_programs/:id
    def destroy
        @user_program = @user.user_programs.find(params[:id])
        @user_program.destroy
        render json: { message: "User program deleted successfully" }, status: :ok    
    end

    private 

    def set_user
        @user = User.find(params[:user_id])
    end

    def user_program_params
        params.require(:user_program).permit(:start_date, :end_date, :name, :num_weeks)
    end

    def authorize_coach_for_user
        unless @user.coach == current_coach
          render json: { error: 'You are not authorized to access this user\'s programs' }, status: :forbidden
        end
    end
end
