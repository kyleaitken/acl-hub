class UsersController < ApplicationController
    def index
        @users = User.all
        render json: @users
    end
    
    def show
        @user = User.find(params[:id])
        render json: @user
    end

    def create
        @user = User.new(user_params)
        if @user.save
            render json: @user, status: :created
        else
            render json: @user.errors, status: :unprocessable_entity
        end
    end

    def update
        @user = User.find(params[:id])
        if @user.update(user_params)
            render json: @user
        else
            render json: @user.errors, status: :unprocessable_entity
        end
    end


    def destroy
        @user = User.find(params[:id])
        if @user.destroy
            render json: { message: 'User deleted successfully' }, status: :ok
        else
            render json: { error: 'Failed to delete user' }, status: :unprocessable_entity
        end  
    end          

    def user_params
        params.require(:user).permit(:first_name, :last_name, :birth_date, :email, :phone, :active, :coach_id)
    end
end
