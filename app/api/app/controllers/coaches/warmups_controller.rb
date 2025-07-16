module Coaches 
    class WarmupsController < ApplicationController
      before_action -> { doorkeeper_authorize! :coach }
  
      # GET /coaches/warmups
      def index
        warmups = current_coach.warmups.includes(:exercises)
        render json: warmups.map { |w| serialize_warmup(w) }
      end

      def show
        warmup = current_coach.warmups.includes(:exercises).find(params[:id])
        render json: serialize_warmup(warmup)
      end

      def create
        warmup = current_coach.warmups.new(warmup_params.except(:exercise_ids))
      
        if warmup.save
          warmup.exercise_ids = warmup_params[:exercise_ids] if warmup_params[:exercise_ids]
          render json: serialize_warmup(warmup), status: :created
        else
          render json: warmup.errors, status: :unprocessable_entity
        end
      end

      def update
        warmup = current_coach.warmups.find(params[:id])
      
        if warmup.update(warmup_params.except(:exercise_ids))
          warmup.exercise_ids = warmup_params[:exercise_ids] if warmup_params[:exercise_ids]
          render json: serialize_warmup(warmup)
        else
          render json: warmup.errors, status: :unprocessable_entity
        end
      end
  
      # DELETE /coaches/warmups/:id
      def destroy
        warmup = current_coach.warmups.find(params[:id])
        warmup.destroy
        head :no_content
      end
  
      private
  
      def warmup_params
        params.permit(:name, :instructions, exercise_ids: [])
      end

      def serialize_warmup(warmup)
        {
          id: warmup.id,
          name: warmup.name,
          instructions: warmup.instructions,
          exercise_ids: warmup.exercise_ids,
          custom: warmup.custom
        }
      end
  
    end
  end