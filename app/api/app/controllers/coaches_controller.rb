class CoachesController < ApplicationController

    # GET /coaches
    def index
        @coaches = Coach.all
        render json: @coaches
    end
    
    # DELETE /coaches/:id
    def destroy
        @coach = Coach.find(params[:id])
        if @coach.destroy
            render json: { message: 'Account deleted successfully.' }, status: :no_content
        else
            render json: @coach.errors, status: :unprocessable_entity
        end
    end

    # Update /coaches/:id
    # def update
    #     @coach = Coach.find(params[:id])
    #     if @coach.destroy
    #         render json: { message: 'Account deleted successfully.' }, status: :no_content
    #     else
    #         render json: @coach.errors, status: :unprocessable_entity
    #     end
    # end
end
