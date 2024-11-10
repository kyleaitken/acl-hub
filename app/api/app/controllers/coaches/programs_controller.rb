module Coaches 
  class ProgramsController < ApplicationController
    before_action -> { doorkeeper_authorize! :coach }
    # before_action :ensure_current_coach

    # GET /coaches/programs
    def index
      @programs = current_coach.programs
      render json: @programs
    end

    # GET /coaches/programs/:id
    def show
      @program = current_coach.programs.find(params[:id])
      render json: @program
    end

    # POST /coaches/programs
    def create
      @program = current_coach.programs.build(program_params)
      if @program.save
        render json: @program, status: :created
      else
        render json: @program.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /coaches/programs/:id
    def update
      @program = current_coach.programs.find(params[:id])
      if @program.update(program_params)
        render json: @program
      else
        render json: @program.errors, status: :unprocessable_entity
      end
    end

    # DELETE /coaches/programs/:id
    def destroy
      @program = current_coach.programs.find(params[:id])
      @program.destroy
      head :no_content
    end

    private

    def program_params
      params.require(:program).permit(:name, :num_weeks)
    end

    # def ensure_current_coach
    #   render json: { error: 'Unauthorized' }, status: :unauthorized unless current_coach
    # end

  end
end