class Coaches::UserOutcomeMeasuresController < ApplicationController
    before_action -> { doorkeeper_authorize! :coach }
    before_action :set_user
    before_action :authorize_coach_for_user

    # GET /coaches/users/:user_id/user_outcome_measures
    def index
        @user_outcome_measures = @user.user_outcome_measures.includes(:outcome_measure)
        render json: @user_outcome_measures.as_json(include: :outcome_measure)
    end
    
    # GET /coaches/users/:user_id/user_outcome_measures/:id
    def show    
        @user_outcome_measure = @user.user_outcome_measures.find(params[:id])
        render json: @user_outcome_measure.as_json(include: :outcome_measure)
    end

    # POST /coaches/users/:user_id/user_outcome_measures
    def create
        @user_outcome_measure = @user.user_outcome_measures.build(user_outcome_measure_params)
        if @user_outcome_measure.save
            render json: @user_outcome_measure, status: :created
        else
            render json: @user_outcome_measure.errors, status: :unprocessable_entity
        end
    end

    # PATCH/PUT /coaches/users/:user_id/user_outcome_measures/:id
    def update
        @user_outcome_measure = @user.user_outcome_measures.find(params[:id])
        if @user_outcome_measure.update(user_outcome_measure_params)
            render json: @user_outcome_measure
        else
            render json: @user_outcome_measure.errors, status: :unprocessable_entity
        end
    end

    # DELETE /coaches/users/:user_id/user_outcome_measures/:id
    def destroy
        @user_outcome_measure = @user.user_outcome_measures.find(params[:id])
        @user_outcome_measure.destroy
        head :no_content
    end

    private 

    def set_user
        @user = User.find(params[:user_id])
    end

    def user_outcome_measure_params
        params.require(:user_outcome_measure).permit(:outcome_measure_id, :target_value)
    end

    def authorize_coach_for_user
        # Check if the user belongs to the coach
        unless @user.coach == current_coach
          render json: { error: 'You are not authorized to access this user\'s outcome measures' }, status: :forbidden
        end
    end
end
