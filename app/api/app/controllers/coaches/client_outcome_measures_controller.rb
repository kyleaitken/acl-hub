class Coaches::ClientOutcomeMeasuresController < ApplicationController
    before_action -> { doorkeeper_authorize! :coach }
    before_action :set_client
    before_action :authorize_coach_for_client

    # GET /coaches/clients/:client_id/client_outcome_measures
    def index
        @client_outcome_measures = @client.client_outcome_measures.includes(:outcome_measure)
        render json: @client_outcome_measures.as_json(include: :outcome_measure)
    end
    
    # GET /coaches/clients/:client_id/client_outcome_measures/:id
    def show    
        @client_outcome_measure = @client.client_outcome_measures.find(params[:id])
        render json: @client_outcome_measure.as_json(include: :outcome_measure)
    end

    # POST /coaches/clients/:client_id/client_outcome_measures
    def create
        @client_outcome_measure = @client.client_outcome_measures.build(client_outcome_measure_params)
        if @client_outcome_measure.save
            render json: @client_outcome_measure, status: :created
        else
            render json: @client_outcome_measure.errors, status: :unprocessable_entity
        end
    end

    # PATCH/PUT /coaches/clients/:client_id/client_outcome_measures/:id
    def update
        @client_outcome_measure = @client.client_outcome_measures.find(params[:id])
        if @client_outcome_measure.update(client_outcome_measure_params)
            render json: @client_outcome_measure
        else
            render json: @client_outcome_measure.errors, status: :unprocessable_entity
        end
    end

    # DELETE /coaches/clients/:client_id/client_outcome_measures/:id
    def destroy
        @client_outcome_measure = @client.client_outcome_measures.find(params[:id])
        @client_outcome_measure.destroy
        head :no_content
    end

    private 

    def set_client
        @client = Client.find(params[:client_id])
    end

    def client_outcome_measure_params
        params.require(:client_outcome_measure).permit(:outcome_measure_id, :target_value)
    end

    def authorize_coach_for_client
        # Check if the client belongs to the coach
        unless @client.coach == current_coach
          render json: { error: 'You are not authorized to access this client\'s outcome measures' }, status: :forbidden
        end
    end
end
