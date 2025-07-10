class Coaches::ClientProgramsController < ApplicationController
    before_action -> { doorkeeper_authorize! :coach }
    before_action :set_client
    before_action :authorize_coach_for_client

    # GET /coaches/clients/:client_id/client_programs
    def index
        @client_programs = @client.client_programs
        render json: @client_programs
    end
    
    # GET /coaches/clients/:client_id/client_programs/:id
    def show    
        @client_program = @client.client_programs.find(params[:id])
        render json: @client_program
    end

    # POST /coaches/clients/:client_id/client_programs
    def create
        @client_program = @client.client_programs.build(client_program_params)
        if @client_program.save
            render json: @client_program, status: :created
        else
            render json: @client_program.errors, status: :unprocessable_entity
        end
    end

    # PUT /coaches/clients/:client_id/client_programs/:id
    def update
        @client_program = @client.client_programs.find(params[:id])
        if @client_program.update(client_program_params)
            render json: @client_program
        else
            render json: @client_program.errors, status: :unprocessable_entity
        end
    end

    # DELETE /coaches/clients/:client_id/client_programs/:id
    def destroy
        @client_program = @client.client_programs.find(params[:id])
        @client_program.destroy
        render json: { message: "client program deleted successfully" }, status: :ok    
    end

    private 

    def set_client
        @client = Client.find(params[:client_id])
    end

    def client_program_params
        params.require(:client_program).permit(:start_date, :end_date, :name, :num_weeks)
    end

    def authorize_coach_for_client
        unless @client.coach == current_coach
          render json: { error: 'You are not authorized to access this client\'s programs' }, status: :forbidden
        end
    end
end
