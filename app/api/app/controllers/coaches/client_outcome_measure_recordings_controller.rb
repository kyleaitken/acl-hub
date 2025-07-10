class Coaches::ClientOutcomeMeasureRecordingsController < ApplicationController
    before_action -> { doorkeeper_authorize! :coach }
    before_action :set_client_outcome_measure 
    before_action :authorize_coach_for_client

    # GET coaches/clients/:client_id/client_outcome_measures/:client_outcome_measure_id/client_outcome_measure_recordings
    def index
        @client_outcome_measure_recordings = @client_outcome_measure.client_outcome_measure_recordings
        render json: @client_outcome_measure_recordings
    end
    
    # GET coaches/clients/:client_id/client_outcome_measures/:client_outcome_measure_id/client_outcome_measure_recordings/:id
    def show
        @client_outcome_measure_recording = @client_outcome_measure.client_outcome_measure_recordings.find(params[:id])
        render json: @client_outcome_measure_recording
    end

    # POST coaches/clients/:client_id/client_outcome_measures/:client_outcome_measure_id/client_outcome_measure_recordings
    def create
        @client_outcome_measure_recording = @client_outcome_measure.client_outcome_measure_recordings.build(client_outcome_measure_recording_params)
        if @client_outcome_measure_recording.save
            render json: @client_outcome_measure_recording, status: :created
        else
            render json: @client_outcome_measure_recording.errors, status: :unprocessable_entity
        end
    end

    # PATCH/PUT coaches/clients/:client_id/client_outcome_measures/:client_outcome_measure_id/client_outcome_measure_recordings/:id
    def update
        @client_outcome_measure_recording = @client_outcome_measure.client_outcome_measure_recordings.find(params[:id])
        if @client_outcome_measure_recording.update(client_outcome_measure_recording_params)
            render json: @client_outcome_measure_recording
        else
            render json: @client_outcome_measure_recording.errors, status: :unprocessable_entity
        end
    end

    # DELETE coaches/clients/:client_id/client_outcome_measures/:client_outcome_measure_id/client_outcome_measure_recordings/:id
    def destroy
        @client_outcome_measure_recording = @client_outcome_measure.client_outcome_measure_recordings.find(params[:id])
        @client_outcome_measure_recording.destroy
        head :no_content
    end

    private

    def client_outcome_measure_recording_params
        params.require(:client_outcome_measure_recording).permit(:value, :date)
    end
    
    def set_client_outcome_measure
        @client = client.find(params[:client_id])
        @client_outcome_measure = @client.client_outcome_measures.find(params[:client_outcome_measure_id])
    end

    def authorize_coach_for_client
        unless @client.coach == current_coach
          render json: { error: 'You are not authorized to access this client\'s outcome measures' }, status: :forbidden
        end
    end
end
