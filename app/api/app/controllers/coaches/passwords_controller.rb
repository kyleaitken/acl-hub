
class Coaches::PasswordsController < Devise::PasswordsController
  respond_to :json

  # POST /resource/password
  def create
    self.resource = resource_class.send_reset_password_instructions(password_params)
    if successfully_sent?(resource)
      render json: { message: 'Reset password instructions sent.' }, status: :ok
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT /resource/password
  def update
    self.resource = resource_class.reset_password_by_token(password_params)
    if resource.errors.empty?
      resource.unlock_access! if unlockable?(resource)
      sign_in(resource_name, resource)
      render json: { message: 'Password has been reset successfully.' }, status: :ok
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def password_params
    params.require(:coach).permit(:email, :reset_password_token, :password, :password_confirmation)
  end
end