class ExercisesController < ApplicationController
    # GET /exercises
    def index
        limit = params[:limit]&.to_i || 50
        page = params[:page]&.to_i || 1
        offset = (page - 1) * limit

        @exercises = Exercise
            .includes(:exercise_images)
            .offset(offset)
            .limit(limit)

        total = Exercise.count
        render json: {
            data: @exercises.as_json(include: :exercise_images),
            pagination: {
                page: page,
                limit: limit,
                total: total,
                has_more: (page * limit) < total
            }
        }
    end

    # GET /exercises/:id
    def show
        @exercise = Exercise.includes(:exercise_images).find(params[:id])
        render json: @exercise.as_json(include: :exercise_images)
    end

    # POST /exercises
    def create
        @exercise = Exercise.new(exercise_params)
        if @exercise.save
            render json: @exercise, status: :created
        else
            render json: @exercise.errors, status: :unprocessable_entity
        end
    end

    # PUT /exercises/:id
    def update
        @exercise = Exercise.find(params[:id])
        if @exercise.update(exercise_params)
            render json: @exercise
        else
            render json: @exercise.errors, status: :unprocessable_entity
        end
    end

    # DELETE /exercises/:id
    def destroy
        @exercise = Exercise.find(params[:id])
        @exercise.destroy
        head :no_content
    end

    private

    def exercise_params
        params.require(:exercise).permit(:name, :description, :category, :muscle_group, :video_url)
    end
end
