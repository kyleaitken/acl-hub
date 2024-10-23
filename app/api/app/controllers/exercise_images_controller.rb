class ExerciseImagesController < ApplicationController
    before_action :set_exercise

    # GET /exercises/:exercise_id/exercise_images
    def index
        @exercise_images = @exercise.exercise_images
        render json: @exercise_images
    end

    # GET /exercises/:exercise_id/exercise_images/:id
    def show
        @exercise_image = @exercise.exercise_images.find(params[:id])
        render json: @exercise_image
    end

    # POST /exercises/:exercise_id/exercise_images
    def create
        @exercise_image = @exercise.exercise_images.build(exercise_image_params)
        if @exercise_image.save
            render json: @exercise_image, status: :created
        else 
            render json: @exercise_image.errors, status: :unprocessable_entity
        end
    end

    #PUT /exercises/:exercise_id/exercise_images/:id
    def update
        @exercise_image = @exercise.exercise_images.find(params[:id])
        if @exercise_image.update(exercise_image_params)
            render json: @exercise_image
        else
            render json: @exercise_image.errors, status: :unprocessable_entity
        end
    end
    
    # dELETE /exercises/:exercise_id/exercise_images/:id
    def destroy
        @exercise_image = @exercise.exercise_images.find(params[:id])
        @exercise_image.destroy
        head :no_content
    end

    private
    
    def set_exercise
        @exercise = Exercise.find(params[:exercise_id])
    end

    def exercise_image_params
        params.require(:exercise_image).permit(:order, :url)
    end
end
