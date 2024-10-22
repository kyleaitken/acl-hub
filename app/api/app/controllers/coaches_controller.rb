class CoachesController < ApplicationController
    def index
        @coaches = Coach.all
        render json: @coaches
    end
    
    def show
        @coach = Coach.find(params[:id])
        render json: @coach
    end

    def create
        @coach = Coach.new(coach_params)
        if @coach.save
            render json: @coach, status: :created
        else
            render json: @coach.errors, status: :unprocessable_entity
        end
    end

    def coach_params
        params.require(:coach).permit(:first_name, :last_name, :email, :phone, :bio)
    end
end
