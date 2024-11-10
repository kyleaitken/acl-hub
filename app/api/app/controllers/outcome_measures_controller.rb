class OutcomeMeasuresController < ApplicationController
    # Possibly limit this to coaches
    
    # GET /outcome_measures
    def index
        @outcome_measures = OutcomeMeasure.all
        render json: @outcome_measures
    end
    
    # GET /outcome_measures/:id
    def show
        @outcome_measure = OutcomeMeasure.find(params[:id])
        render json: @outcome_measure
    end

    # POST /outcome_measures
    def create
        @outcome_measure = OutcomeMeasure.new(outcome_measure_params)
        if @outcome_measure.save
            render json: @outcome_measure, status: :created
        else
            render json: @outcome_measure.errors, status: :unprocessable_entity
        end
    end

    # PATCH/PUT /outcome_measures/:id
    def update
        @outcome_measure = OutcomeMeasure.find(params[:id])
        if @outcome_measure.update(outcome_measure_params)
            render json: @outcome_measure
        else
            render json: @outcome_measure.errors, status: :unprocessable_entity
        end
    end

    # DELETE /outcome_measures/:id
    def destroy
        @outcome_measure = OutcomeMeasure.find(params[:id])
        @outcome_measure.destroy
        head :no_content
    end

    private 
    
    def outcome_measure_params
        params.require(:outcome_measure).permit(:name)
    end
end
