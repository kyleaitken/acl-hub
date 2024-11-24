class Coaches::SessionsController < Devise::SessionsController
  respond_to :json

  skip_before_action :verify_signed_out_user, only: :destroy

  def create
    self.resource = warden.authenticate!(auth_options)
    if resource
      # Create an access token for the user
      token = Doorkeeper::AccessToken.create!(
        resource_owner_id: resource.id,
        resource_owner_type: 'Coach',
        scopes: 'coach'  
      )
      render json: { coach: resource, token: token.token }, status: :created
    else
      render json: { error: 'Invalid credentials' }, status: :unauthorized
    end
  end

  def destroy
    # Find the current access token based on the request
    token = Doorkeeper::AccessToken.find_by(token: request.headers['Authorization']&.split(' ')&.last || params[:token])
    if token && token.destroy
      render json: { message: 'Logged out successfully' }, status: :ok
    else
      render json: { error: 'Invalid token' }, status: :unauthorized
    end
  end

end