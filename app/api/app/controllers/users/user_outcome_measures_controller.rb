class Users::UserOutcomeMeasuresController < ApplicationController
    before_action -> { doorkeeper_authorize! :user }

    # GET /user/user_outcome_measures
    def index
        if current_user.nil?
            raise Api::V1::Errors::Unauthorized, "User not found"
        end
        @user_outcome_measures = current_user.user_outcome_measures.includes(:outcome_measure)
        render json: @user_outcome_measures.as_json(include: :outcome_measure)
    end
    
    # GET /user/user_outcome_measures/:id
    def show    
        @user_outcome_measure = current_user.user_outcome_measures.find(params[:id])
        render json: @user_outcome_measure.as_json(include: :outcome_measure)
    end

    # POST /user/user_outcome_measures
    def create
        @user_outcome_measure = current_user.user_outcome_measures.build(user_outcome_measure_params)
        if @user_outcome_measure.save
            render json: @user_outcome_measure, status: :created
        else
            render json: @user_outcome_measure.errors, status: :unprocessable_entity
        end
    end

    # PATCH/PUT /user/user_outcome_measures/:id
    def update
        @user_outcome_measure = current_user.user_outcome_measures.find(params[:id])
        if @user_outcome_measure.update(user_outcome_measure_params)
            render json: @user_outcome_measure
        else
            render json: @user_outcome_measure.errors, status: :unprocessable_entity
        end
    end

    # DELETE /user/user_outcome_measures/:id
    def destroy
        @user_outcome_measure = current_user.user_outcome_measures.find(params[:id])
        @user_outcome_measure.destroy
        head :no_content
    end

    private 

    # def set_user
    #     @user = User.find(params[:user_id])
    # end

    def user_outcome_measure_params
        params.require(:user_outcome_measure).permit(:outcome_measure_id, :target_value)
    end
end
