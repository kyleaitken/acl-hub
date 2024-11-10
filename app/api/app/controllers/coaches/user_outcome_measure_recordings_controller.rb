class Coaches::UserOutcomeMeasureRecordingsController < ApplicationController
    before_action -> { doorkeeper_authorize! :coach }
    before_action :set_user_outcome_measure 
    before_action :authorize_coach_for_user

    # GET coaches/users/:user_id/user_outcome_measures/:user_outcome_measure_id/user_outcome_measure_recordings
    def index
        @user_outcome_measure_recordings = @user_outcome_measure.user_outcome_measure_recordings
        render json: @user_outcome_measure_recordings
    end
    
    # GET coaches/users/:user_id/user_outcome_measures/:user_outcome_measure_id/user_outcome_measure_recordings/:id
    def show
        @user_outcome_measure_recording = @user_outcome_measure.user_outcome_measure_recordings.find(params[:id])
        render json: @user_outcome_measure_recording
    end

    # POST coaches/users/:user_id/user_outcome_measures/:user_outcome_measure_id/user_outcome_measure_recordings
    def create
        @user_outcome_measure_recording = @user_outcome_measure.user_outcome_measure_recordings.build(user_outcome_measure_recording_params)
        if @user_outcome_measure_recording.save
            render json: @user_outcome_measure_recording, status: :created
        else
            render json: @user_outcome_measure_recording.errors, status: :unprocessable_entity
        end
    end

    # PATCH/PUT coaches/users/:user_id/user_outcome_measures/:user_outcome_measure_id/user_outcome_measure_recordings/:id
    def update
        @user_outcome_measure_recording = @user_outcome_measure.user_outcome_measure_recordings.find(params[:id])
        if @user_outcome_measure_recording.update(user_outcome_measure_recording_params)
            render json: @user_outcome_measure_recording
        else
            render json: @user_outcome_measure_recording.errors, status: :unprocessable_entity
        end
    end

    # DELETE coaches/users/:user_id/user_outcome_measures/:user_outcome_measure_id/user_outcome_measure_recordings/:id
    def destroy
        @user_outcome_measure_recording = @user_outcome_measure.user_outcome_measure_recordings.find(params[:id])
        @user_outcome_measure_recording.destroy
        head :no_content
    end

    private

    def user_outcome_measure_recording_params
        params.require(:user_outcome_measure_recording).permit(:value, :date)
    end
    
    def set_user_outcome_measure
        @user = User.find(params[:user_id])
        @user_outcome_measure = @user.user_outcome_measures.find(params[:user_outcome_measure_id])
    end

    def authorize_coach_for_user
        unless @user.coach == current_coach
          render json: { error: 'You are not authorized to access this user\'s outcome measures' }, status: :forbidden
        end
    end
end
