class CoachesController < ApplicationController
    before_action -> { doorkeeper_authorize! :coach }

    # GET /coaches
    def index
        @coaches = Coach.all
        render json: @coaches
    end
    
end
