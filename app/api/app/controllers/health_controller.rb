class HealthController < ApplicationController
  def check
    render json: { status: 'OK' }, status: :ok
  end
end