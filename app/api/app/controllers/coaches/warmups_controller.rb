module Coaches 
    class WarmupsController < ApplicationController
      before_action -> { doorkeeper_authorize! :coach }
  
      # GET /coaches/warmups
      def index
        rel = current_coach.warmups.includes(:exercises)
        if params.key?(:custom)
          # allow ?custom=true or ?custom=false
          rel = rel.where(custom: ActiveModel::Type::Boolean.new.cast(params[:custom]))
        else
          rel = rel.where(custom: false)   # default to library
        end
      
        render json: rel.map { |w| serialize_warmup(w) }
      end

      def show
        warmup = current_coach.warmups.includes(:exercises).find(params[:id])
        render json: serialize_warmup(warmup)
      end

      def detailed
        warmup = current_coach.warmups.includes(:exercises).find(params[:id])
        render json: serialize_detailed_warmup(warmup)
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

      def serialize_detailed_warmup(warmup)
        {
          id: warmup.id,
          name: warmup.name,
          instructions: warmup.instructions,
          custom: warmup.custom,
          coach_id: warmup.coach_id,
          created_at: warmup.created_at.iso8601,
          updated_at: warmup.updated_at.iso8601,
          exercises: warmup.exercises.map do |ex|
            {
              id: ex.id,
              name: ex.name,
              description: ex.description,
              video_url: ex.video_url,
            }
          end
        }
      end

    end
  end