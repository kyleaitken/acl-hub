class Users::UserProgramsController < ApplicationController
    before_action -> { doorkeeper_authorize! :user }

    # GET /users/user_programs
    def index
        @user_programs = current_user.user_programs
        render json: @user_programs
    end

    # GET /users/user_programs/:id
    def show
        @user_program = current_user.user_programs.find(params[:id])
        render json: @user_program
    end

    # PUT /users/user_programs/:id
    def update
        @user_program = current_user.user_programs.find(params[:id])
        if @user_program.update(user_program_params)
            render json: @user_program
        else
            render json: @user_program.errors, status: :unprocessable_entity
        end
    end

    # POST /users/user_programs
    def create
        @user_program = current_user.user_programs.build(user_program_params)
        if @user_program.save
            render json: @user_program, status: :created
        else
            render json: @user_program.errors, status: :unprocessable_entity
        end
    end

    # DELETE /users/user_programs/:id
    def destroy
        @user_program = current_user.user_programs.find(params[:id])
        @user_program.destroy
        render json: { message: "Deleted successfully" }, status: :ok    
    end
    
    private

    def user_program_params
        params.require(:user_program).permit(:start_date, :end_date, :name, :num_weeks)
    end
end
