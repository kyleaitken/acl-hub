class UsersController < ApplicationController

    def index
        Rails.logger.info("Doorkeeper Token in UsersController Index: #{doorkeeper_token.inspect}")
        @users = User.all
        render json: @users
    end
    
    # def show
    #     Rails.logger.info("Doorkeeper Token in UsersController Show: #{doorkeeper_token.inspect}")
    #     @user = User.find(params[:id])
    #     render json: @user
    # end

end
