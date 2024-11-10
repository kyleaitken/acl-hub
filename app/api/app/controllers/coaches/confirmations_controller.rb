class Coaches::ConfirmationsController < Devise::ConfirmationsController
  respond_to :json

  # POST /resource/confirmation
  def create
    self.resource = resource_class.send_confirmation_instructions(confirmation_params)
    if successfully_sent?(resource)
      render json: { message: 'Confirmation instructions sent.' }, status: :ok
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /resource/confirmation?confirmation_token=abcdef
  def show
    self.resource = resource_class.confirm_by_token(confirmation_params[:confirmation_token])
    if resource.errors.empty?
      render json: { message: 'Your account has been confirmed.' }, status: :ok
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def confirmation_params
    params.require(:coach).permit(:email, :confirmation_token)
  end
end