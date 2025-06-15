class Clients::ClientProgramWorkoutsController < ApplicationController
    before_action -> { doorkeeper_authorize! :client }
    before_action :set_client_program

    # GET /clients/client_programs/client_program_id/client_program_workouts
    def index
        @client_program_workouts = @client_program.client_program_workouts
        render json: @client_program_workouts
    end

    # GET /clients/client_programs/client_program_id/client_program_workouts/:id
    def show
        @client_program_workout = @client_program.client_program_workouts.find(params[:id])
        render json: @client_program_workout
    end

    # PUT /clients/client_programs/client_program_id/client_program_workouts/:id
    def update
        @client_program_workout = @client_program.client_program_workouts.find(params[:id])
        if @client_program_workout.update(client_program_workout_params)
            render json: @client_program_workout
        else
            render json: @client_program_workout.errors, status: :unprocessable_entity
        end
    end

    # POST /clients/client_programs/client_program_id/client_program_workouts
    def create
        @client_program_workout = @client_program.client_program_workouts.build(client_program_workout_params)
        if @client_program_workout.save
            render json: @client_program_workout, status: :created
        else
            render json: @client_program_workout.errors, status: :unprocessable_entity
        end
    end

    # DELETE /clients/client_programs/client_program_id/client_program_workouts/:id
    def destroy
        @client_program_workout = @client_program.client_program_workouts.find(params[:id])
        @client_program_workout.destroy
        render json: { message: "Deleted successfully" }, status: :ok    
    end
    
    private

    def client_program_workout_params
        params.require(:client_program_workout).permit(:date, :day, :week, :comment, :completed, :order)
    end

    def set_client_program
        @client_program = ClientProgram.find(params[:client_program_id])
    end
end
