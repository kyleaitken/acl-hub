class CoachesController < ApplicationController
    # GET /coaches
    def index
        @coaches = Coach.all
        render json: @coaches
    end
    
    # GET /coaches/:id
    def show
        @coach = Coach.find(params[:id])
        render json: @coach
    end

    # POST /coaches
    def create
        @coach = Coach.new(coach_params)
        if @coach.save
            render json: @coach, status: :created
        else
            render json: @coach.errors, status: :unprocessable_entity
        end
    end

    # PATCH/PUT /coaches/:id
    def update
        @coach = Coach.find(params[:id])
        if @coach.update(coach_params)
            render json: @coach
        else
            render json: @coach.errors, status: :unprocessable_entity
        end
    end

    # DELETE /coaches/:id
    def destroy
        @coach = Coach.find(params[:id])
        @coach.destroy
        head :no_content
    end

    def coach_params
        params.require(:coach).permit(:first_name, :last_name, :email, :phone, :bio)
    end
end
