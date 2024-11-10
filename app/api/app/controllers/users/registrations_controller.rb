# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  # POST /users
  def create
    build_resource(sign_up_params)

    if resource.save
      render json: { user: resource, message: 'User account created successfully.' }, status: :created
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT /resource
  def update
    self.resource = current_user
    if resource.update(account_update_params)
      render json: { user: resource, message: 'User account updated successfully.' }, status: :ok
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  # Define parameters permitted for sign up
  def sign_up_params
    params.require(:user).permit(:first_name, :last_name, :birth_date, :email, :phone, :active, :coach_id, :password, :password_confirmation)
  end

  # Define parameters permitted for account update
  def account_update_params
    params.require(:user).permit(:first_name, :last_name, :birth_date, :email, :phone, :active, :coach_id, :password, :password_confirmation, :current_password)
  end
end
