class Users::WorkoutCommentsController < ApplicationController
  before_action :set_user_program_workout
  before_action :set_workout_comment, only: [:update, :destroy]

    # POST /users/:user_id/user_programs/:user_program_id/user_program_workouts/:user_program_workout_id/workout_comments
    def create
      comment = @user_program_workout.workout_comments.build(comment_params)
      if comment.save
        render json: comment, status: :created
      else
        render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # PATCH /users/:user_id/user_programs/:user_program_id/user_program_workouts/:user_program_workout_id/workout_comments/:id
    def update
      if @workout_comment.update(comment_params)
        render json: @workout_comment, status: :ok
      else
        render json: { errors: @workout_comment.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # DELETE /users/:user_id/user_programs/:user_program_id/user_program_workouts/:user_program_workout_id/workout_comments/:id
    def destroy
      @workout_comment.destroy
      render json: { message: "Workout comment deleted successfully" }, status: :ok    
    end

  private

  def set_user_program_workout
    @user_program_workout = UserProgramWorkout.find(params[:user_program_workout_id])
  end

  def set_workout_comment
    @workout_comment = @user_program_workout.workout_comments.find(params[:id])
  end

  def comment_params
    params.require(:workout_comment).permit(:content, :timestamp, :user_type)
  end
end
