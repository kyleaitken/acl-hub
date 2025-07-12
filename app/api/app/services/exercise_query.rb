# app/services/exercise_query.rb
class ExerciseQuery
    def initialize(params)
      @params = params
    end
  
    def results
        if @params[:query].present?
          search_results
        elsif @params[:page].present? || @params[:limit].present?
          paginated_results
        else
          all_exercises
        end
    end

    def all_exercises
        Exercise.includes(:exercise_images).order(:name)
    end
  
    def paginated?
        @params[:query].blank? && (@params[:page].present? || @params[:limit].present?)
    end
  
    def total_count
      Exercise.count
    end
  
    private
  
    def search_results
      Exercise
        .where("LOWER(name) LIKE ?", "%#{@params[:query].downcase}%")
        .limit(10)
        .order(:name)
    end
  
    def paginated_results
      limit = @params[:limit]&.to_i || 50
      page = @params[:page]&.to_i || 1
      offset = (page - 1) * limit
  
      Exercise
        .includes(:exercise_images)
        .offset(offset)
        .limit(limit)
    end
end
  