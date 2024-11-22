module Coaches    
    class AccountsController < ApplicationController
        before_action -> { doorkeeper_authorize! :coach }

        # GET /coaches/account
        def show
            # Show the current coach's account info
            render json: current_coach
        end
    
        # PUT /coaches/account
        def update
            # Attempt to update the coach's account information
            if current_coach.update(account_params)
                render json: { coach: current_coach, message: 'Account updated successfully.' }, status: :ok
            else
                render json: { errors: current_coach.errors.full_messages }, status: :unprocessable_entity
            end
        end
  
        # DELETE /coaches/account
        def destroy
            # Delete the coach's account
            current_coach.destroy
            render json: { message: 'Account deleted successfully.' }, status: :no_content
        end
    
        private
    
        # Strong parameters for account update
        def account_params
            params.require(:coach).permit(:first_name, :last_name, :email, :phone, :bio)
        end
    end
end