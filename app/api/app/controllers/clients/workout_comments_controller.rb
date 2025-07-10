class Clients::WorkoutCommentsController < ApplicationController
  before_action :set_client_program_workout
  before_action :set_workout_comment, only: [:update, :destroy]

    # POST /clients/:client_id/client_programs/:client_program_id/client_program_workouts/:client_program_workout_id/workout_comments
    def create
      comment = @client_program_workout.workout_comments.build(comment_params)
      if comment.save
        render json: comment, status: :created
      else
        render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # PATCH /clients/:client_id/client_programs/:client_program_id/client_program_workouts/:client_program_workout_id/workout_comments/:id
    def update
      if @workout_comment.update(comment_params)
        render json: @workout_comment, status: :ok
      else
        render json: { errors: @workout_comment.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # DELETE /clients/:client_id/client_programs/:client_program_id/client_program_workouts/:client_program_workout_id/workout_comments/:id
    def destroy
      @workout_comment.destroy
      render json: { message: "Workout comment deleted successfully" }, status: :ok    
    end

  private

  def set_client_program_workout
    @client_program_workout = ClientProgramWorkout.find(params[:client_program_workout_id])
  end

  def set_workout_comment
    @workout_comment = @client_program_workout.workout_comments.find(params[:id])
  end

  def comment_params
    params.require(:workout_comment).permit(:content, :timestamp, :user_type)
  end
end
