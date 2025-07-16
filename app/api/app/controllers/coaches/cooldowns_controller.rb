module Coaches 
  class CooldownsController < ApplicationController
    before_action -> { doorkeeper_authorize! :coach }

    # GET /coaches/cooldowns
    def index
      cooldowns = current_coach.cooldowns.includes(:exercises)
      render json: cooldowns.map { |c| serialize_cooldown(c) }
    end

    def show
      cooldown = current_coach.cooldowns.includes(:exercises).find(params[:id])
      render json: serialize_cooldown(cooldown)
    end

    def create
      cooldown = current_coach.cooldowns.new(cooldown_params.except(:exercise_ids))
    
      if cooldown.save
        cooldown.exercise_ids = cooldown_params[:exercise_ids] if cooldown_params[:exercise_ids]
        render json: serialize_cooldown(cooldown), status: :created
      else
        render json: cooldown.errors, status: :unprocessable_entity
      end
    end

    def update
      cooldown = current_coach.cooldowns.find(params[:id])
    
      if cooldown.update(cooldown_params.except(:exercise_ids))
        cooldown.exercise_ids = cooldown_params[:exercise_ids] if cooldown_params[:exercise_ids]
        render json: serialize_cooldown(cooldown)
      else
        render json: cooldown.errors, status: :unprocessable_entity
      end
    end

    # DELETE /coaches/cooldowns/:id
    def destroy
      cooldown = current_coach.cooldowns.find(params[:id])
      cooldown.destroy
      head :no_content
    end

    private

    def cooldown_params
      params.permit(:name, :instructions, exercise_ids: [])
    end

    def serialize_cooldown(cooldown)
      {
        id: cooldown.id,
        name: cooldown.name,
        instructions: cooldown.instructions,
        exercise_ids: cooldown.exercise_ids,
        custom: cooldown.custom
      }
    end

  end
end