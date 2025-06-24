module Coaches 
  class TagsController < ApplicationController
    before_action -> { doorkeeper_authorize! :coach }
    # before_action :ensure_current_coach

    # GET /coaches/tags
    def index
      @tags = current_coach.tags
      render json: @tags
    end

    # POST /coaches/tags
    def create
      @tag = current_coach.tags.build(tag_params)
      if @tag.save
        render json: @tag, status: :created
      else
        render json: @tag.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /coaches/programs/:id
    def update
      @tag = current_coach.tags.find(params[:id])
      if @tag.update(tag_params)
        render json: @tag
      else
        render json: @tag.errors, status: :unprocessable_entity
      end
    end

    # DELETE /coaches/programs/:id
    def destroy
      @tag = current_coach.tags.find(params[:id])
      @tag.destroy
      head :no_content
    end

    private

    def tag_params
      params.require(:tag).permit(:name)
    end

    # def ensure_current_coach
    #   render json: { error: 'Unauthorized' }, status: :unauthorized unless current_coach
    # end

  end
end