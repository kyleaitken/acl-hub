class ProgramsController < ApplicationController
    before_action :set_coach

    # GET /coaches/:id/programs
    def index
      @programs = @coach.programs
      render json: @programs
    end
  
    # GET /coaches/:id/programs/:id
    def show
      @program = @coach.programs.find(params[:id])
      render json: @program
    end
  
    # POST /coaches/:id/programs
    def create
      @program = @coach.programs.build(program_params)
      if @program.save
        render json: @program, status: :created
      else
        render json: @program.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /coaches/:id/programs/:id
    def update
        @program = @coach.programs.find(params[:id])
        if @program.update(program_params)
            render json: @program
        else
            render json: @program.errors, status: :unprocessable_entity
        end
    end

    # DELETE /coaches/:id
    def destroy
        @program = @coach.programs.find(params[:id])
        @program.destroy
        head :no_content
    end
  
    private
  
    def set_coach
      @coach = Coach.find(params[:coach_id])
    end
  
    def program_params
      params.require(:program).permit(:name, :num_weeks)
    end
end
