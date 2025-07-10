class ClientsController < ApplicationController

    def index
        Rails.logger.info("Doorkeeper Token in ClientsController Index: #{doorkeeper_token.inspect}")
        @clients = Client.all
        render json: @clients
    end
    
    # def show
    #     Rails.logger.info("Doorkeeper Token in ClientsController Show: #{doorkeeper_token.inspect}")
    #     @client = Client.find(params[:id])
    #     render json: @client
    # end

end
