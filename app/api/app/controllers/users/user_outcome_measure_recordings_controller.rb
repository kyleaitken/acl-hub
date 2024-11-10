module Users
    class UserOutcomeMeasureRecordingsController < ApplicationController
        before_action -> { doorkeeper_authorize! :user }
        before_action :set_user_outcome_measure 

        # GET users/user_outcome_measures/:user_outcome_measure_id/user_outcome_measure_recordings
        def index
            @user_outcome_measure_recordings = @user_outcome_measure.user_outcome_measure_recordings
            render json: @user_outcome_measure_recordings
        end
        
        # GET users/user_outcome_measures/:user_outcome_measure_id/user_outcome_measure_recordings/:id
        def show
            @user_outcome_measure_recording = @user_outcome_measure.user_outcome_measure_recordings.find(params[:id])
            render json: @user_outcome_measure_recording
        end

        # POST /user_outcome_measures/:user_outcome_measure_id/user_outcome_measure_recordings
        def create
            @user_outcome_measure_recording = @user_outcome_measure.user_outcome_measure_recordings.build(user_outcome_measure_recording_params)
            if @user_outcome_measure_recording.save
                render json: @user_outcome_measure_recording, status: :created
            else
                render json: @user_outcome_measure_recording.errors, status: :unprocessable_entity
            end
        end

        # PATCH/PUT /user_outcome_measures/:user_outcome_measure_id/user_outcome_measure_recordings/:id
        def update
            @user_outcome_measure_recording = @user_outcome_measure.user_outcome_measure_recordings.find(params[:id])
            if @user_outcome_measure_recording.update(user_outcome_measure_recording_params)
                render json: @user_outcome_measure_recording
            else
                render json: @user_outcome_measure_recording.errors, status: :unprocessable_entity
            end
        end

        # DELETE /user_outcome_measures/:user_outcome_measure_id/user_outcome_measure_recordings/:id
        def destroy
            @user_outcome_measure_recording = @user_outcome_measure.user_outcome_measure_recordings.find(params[:id])
            @user_outcome_measure_recording.destroy
            head :no_content
        end

        private

        def set_user_outcome_measure
            @user_outcome_measure = UserOutcomeMeasure.find(params[:user_outcome_measure_id])
        end

        def user_outcome_measure_recording_params
            params.require(:user_outcome_measure_recording).permit(:value, :date)
        end
    end
end