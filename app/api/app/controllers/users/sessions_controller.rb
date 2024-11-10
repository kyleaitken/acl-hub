# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  respond_to :json

  def create
    self.resource = warden.authenticate!(auth_options)
    if resource
      # Create an access token for the user
      token = Doorkeeper::AccessToken.create!(
        resource_owner_id: resource.id,
        resource_owner_type: 'User',
        scopes: 'user'  
      )
      render json: { user: resource, token: token.token }, status: :created
    else
      render json: { error: 'Invalid credentials' }, status: :unauthorized
    end
  end

  def destroy
    # Find the current access token based on the request
    token = Doorkeeper::AccessToken.find_by(token: params[:token])
    if token && token.destroy
      signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
      render json: { message: 'Logged out successfully' }, status: :ok
    else
      render json: { error: 'Invalid token' }, status: :unauthorized
    end
  end
end
