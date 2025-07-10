class Coaches::ClientProgramWorkoutsController < ApplicationController
    before_action -> { doorkeeper_authorize! :coach }
    before_action :set_client_program
    before_action :authorize_coach_for_client

    # GET /coaches/clients/:client_id/client_programs/:client_program_id/client_program_workouts
    def index
        @client_program_workouts = @client_program.client_program_workouts.includes(:workout_comments)
        render json: @client_program_workouts.as_json(
            include: {
              workout_comments: {
                only: [:id, :content, :timestamp, :user_type] 
              }
            }
          )    
    end
    
    # GET /coaches/clients/:client_id/client_programs/:client_program_id/client_program_workouts/:id
    def show    
        @client_program_workout = @client_program.client_program_workouts.find(params[:id])
        render json: @client_program_workout.as_json(
            include: {
              workout_comments: {
                only: [:id, :content, :timestamp, :user_type] 
              }
            }
          )     
    end

    # POST /coaches/clients/:client_id/client_programs/:client_program_id/client_program_workouts
    def create
        @client_program_workout = @client_program.client_program_workouts.build(client_program_workout_params)
        if @client_program_workout.save
            render json: @client_program_workout, status: :created
        else
            render json: @client_program_workout.errors, status: :unprocessable_entity
        end
    end

    # PUT /coaches/clients/:client_id/client_programs/:client_program_id/client_program_workouts/:id
    def update
        @client_program_workout = @client_program.client_program_workouts.find(params[:id])
        if @client_program_workout.update(client_program_workout_params)
            render json: @client_program_workout
        else
            render json: @client_program_workout.errors, status: :unprocessable_entity
        end
    end

    # DELETE /coaches/clients/:client_id/client_programs/:client_program_id/client_program_workouts/:id
    def destroy
        @client_program_workout = @client_program.client_program_workouts.find(params[:id])
        @client_program_workout.destroy
        render json: { message: "Client program workout deleted successfully" }, status: :ok    
    end

    private 

    def set_client_program
        @client = Client.find(params[:client_id])
        @client_program = @client.client_programs.find(params[:client_program_id])
    end

    def client_program_workout_params
        params.require(:client_program_workout).permit(:date, :day, :week, :completed, :order, :name, :warmup)
    end

    def authorize_coach_for_client
        unless @client.coach == current_coach
          render json: { error: 'You are not authorized to access this client\'s programs' }, status: :forbidden
        end
    end
end
