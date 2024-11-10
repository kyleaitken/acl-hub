class Coaches::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  # POST /coaches
  def create
    build_resource(sign_up_params)

    if resource.save
      render json: { coach: resource, message: 'Account created successfully.' }, status: :created
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT /resource
  def update
    self.resource = resource_class.to_adapter.get!(current_coach.id)
    if resource.update(account_update_params)
      render json: { coach: resource, message: 'Account updated successfully.' }, status: :ok
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  # Define parameters permitted for sign up
  def sign_up_params
    params.require(:coach).permit(:first_name, :last_name, :email, :phone, :bio, :password, :password_confirmation)
  end

  # Define parameters permitted for account update
  def account_update_params
    params.require(:coach).permit(:first_name, :last_name, :email, :phone, :bio, :password, :password_confirmation, :current_password)
  end
end