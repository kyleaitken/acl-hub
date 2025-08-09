class ExerciseQuery
  def initialize(params)
    @params = params
  end

  def results
    if @params[:query].present?
      search_results
    elsif paginated?
      paginated_results
    else
      all_exercises
    end
  end

  # used when no paging or search
  def all_exercises
    Exercise.global
            .includes(:exercise_images)
            .order(:name)
  end

  def paginated?
    @params[:query].blank? && (@params[:page].present? || @params[:limit].present?)
  end

  # only count the non-custom ones
  def total_count
    Exercise.global.count
  end

  private

  def search_results
    Exercise.global
            .where("LOWER(name) LIKE ?", "%#{@params[:query].downcase}%")
            .includes(:exercise_images)
            .order(:name)
            .limit(10)
  end

  def paginated_results
    limit  = @params[:limit]&.to_i  || 50
    page   = @params[:page]&.to_i   || 1
    offset = (page - 1) * limit

    Exercise.global
            .includes(:exercise_images)
            .order(:name)
            .offset(offset)
            .limit(limit)
  end
end
