class Coaches::RegistrationsController < Devise::RegistrationsController
  respond_to :json
  # before_action -> { 
  #   Rails.logger.debug("Token: #{doorkeeper_token}")
  #   Rails.logger.debug("Scopes: #{doorkeeper_token.scopes}")
  #   Rails.logger.debug("Owner ID: #{doorkeeper_token.resource_owner_id}")
  #   doorkeeper_authorize! :coach 
  # }, only: [:update]

  # POST /coaches
  def create
    build_resource(sign_up_params)

    if resource.save
      render json: { coach: resource, message: 'Account created successfully.' }, status: :created
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  # Define parameters permitted for sign up
  def sign_up_params
    params.require(:coach).permit(:first_name, :last_name, :email, :phone, :bio, :password, :password_confirmation)
  end

end