module Coaches 
    class CooldownsController < ApplicationController
      before_action -> { doorkeeper_authorize! :coach }
  
      # GET /coaches/cooldowns
      def index
        cooldowns = current_coach.cooldowns.select(:id, :name)
        render json: cooldowns
      end

      def show
        cooldown = current_coach.cooldowns.includes(:exercises).find(params[:id])
        render json: cooldown.as_json(include: :exercises)
      end

      # POST /coaches/cooldowns
      def create
        cooldown = current_coach.cooldowns.new(cooldown_params)
        if cooldown.save
          render json: cooldown.as_json(include: :exercises), status: :created
        else
          render json: cooldown.errors, status: :unprocessable_entity
        end
      end
  
      # PATCH/PUT /coaches/cooldowns/:id
      def update
        cooldown = current_coach.cooldowns.find(params[:id])
        if cooldown.update(cooldown_params)
          render json: cooldown.as_json(include: :exercises)
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
  
    end
  end