class Clients::ClientOutcomeMeasuresController < ApplicationController
    before_action -> { doorkeeper_authorize! :client }

    # GET /client/client_outcome_measures
    def index
        if current_client.nil?
            raise Api::V1::Errors::Unauthorized, "Client not found"
        end
        @client_outcome_measures = current_client.client_outcome_measures.includes(:outcome_measure)
        render json: @client_outcome_measures.as_json(include: :outcome_measure)
    end
    
    # GET /client/client_outcome_measures/:id
    def show    
        @client_outcome_measure = current_client.client_outcome_measures.find(params[:id])
        render json: @client_outcome_measure.as_json(include: :outcome_measure)
    end

    # POST /client/client_outcome_measures
    def create
        @client_outcome_measure = current_client.client_outcome_measures.build(client_outcome_measure_params)
        if @client_outcome_measure.save
            render json: @client_outcome_measure, status: :created
        else
            render json: @client_outcome_measure.errors, status: :unprocessable_entity
        end
    end

    # PATCH/PUT /client/client_outcome_measures/:id
    def update
        @client_outcome_measure = current_client.client_outcome_measures.find(params[:id])
        if @client_outcome_measure.update(client_outcome_measure_params)
            render json: @client_outcome_measure
        else
            render json: @client_outcome_measure.errors, status: :unprocessable_entity
        end
    end

    # DELETE /client/client_outcome_measures/:id
    def destroy
        @client_outcome_measure = current_client.client_outcome_measures.find(params[:id])
        @client_outcome_measure.destroy
        head :no_content
    end

    private 

    # def set_client
    #     @client = client.find(params[:client_id])
    # end

    def client_outcome_measure_params
        params.require(:client_outcome_measure).permit(:outcome_measure_id, :target_value)
    end
end
