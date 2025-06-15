class ApplicationController < ActionController::API
    include Devise::Controllers::Helpers
  
    private
  
    # Method to retrieve the current coach based on the Doorkeeper token
    def current_coach
      # Only look up the coach if a token is present
      @current_coach ||= Coach.find_by(id: doorkeeper_token&.resource_owner_id)
    end

    def current_client
      # Rails.logger.info("Doorkeeper token: #{doorkeeper_token.inspect}")
      # if doorkeeper_token.nil? || doorkeeper_token.expired?
      #   raise Api::V1::Errors::Unauthorized, "Invalid or expired token"
      # end
      # Rails.logger.info("Fetching client from token ID: #{doorkeeper_token&.resource_owner_id}")
      @current_client ||= Client.find_by(id: doorkeeper_token&.resource_owner_id)
      # Rails.logger.info("Client found: #{@current_client.inspect}")
      @current_client
    end
end