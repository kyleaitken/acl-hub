class Clients::ClientProgramsController < ApplicationController
    before_action -> { doorkeeper_authorize! :client }

    # GET /clients/client_programs
    def index
        @client_programs = current_client.client_programs
        render json: @client_programs
    end

    # GET /clients/client_programs/:id
    def show
        @client_program = current_client.client_programs.find(params[:id])
        render json: @client_program
    end

    # PUT /clients/client_programs/:id
    def update
        @client_program = current_client.client_programs.find(params[:id])
        if @client_program.update(client_program_params)
            render json: @client_program
        else
            render json: @client_program.errors, status: :unprocessable_entity
        end
    end

    # POST /clients/client_programs
    def create
        @client_program = current_client.client_programs.build(client_program_params)
        if @client_program.save
            render json: @client_program, status: :created
        else
            render json: @client_program.errors, status: :unprocessable_entity
        end
    end

    # DELETE /clients/client_programs/:id
    def destroy
        @client_program = current_client.client_programs.find(params[:id])
        @client_program.destroy
        render json: { message: "Deleted successfully" }, status: :ok    
    end
    
    private

    def client_program_params
        params.require(:client_program).permit(:start_date, :end_date, :name, :num_weeks)
    end
end
