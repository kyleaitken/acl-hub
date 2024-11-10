module Coaches
    class UsersController < ApplicationController
        before_action -> { doorkeeper_authorize! :coach }

        # GET /coaches/users
        def index
            @users = current_coach.users 
            render json: @users
        end

        # GET /coaches/users/:id
        def show
            @user = current_coach.users.find_by(id: params[:id])
            if @user
                render json: @user
            else
                render json: { error: 'User not found' }, status: :not_found
            end
        end

        # PUT /coaches/users/:id
        def update
            @user = current_coach.users.find_by(id: params[:id])
            if @user
                if @user.update(user_update_params)
                    render json: { user: @user, message: 'User updated successfully.' }, status: :ok
                else
                    render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
                end
            else
                render json: { error: 'User not found' }, status: :not_found
            end
        end

        private

        def user_update_params
          params.require(:user).permit(:active)
        end
    end
end