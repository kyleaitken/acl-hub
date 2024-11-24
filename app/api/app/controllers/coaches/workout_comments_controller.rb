class Coaches::WorkoutCommentsController < ApplicationController
  before_action -> { doorkeeper_authorize! :coach }
  before_action :set_user_program_workout
  before_action :set_workout_comment, only: [:update, :destroy]
  before_action :authorize_coach_for_user

  # POST /coaches/users/:user_id/user_programs/:user_program_id/user_program_workouts/:user_program_workout_id/workout_comments
  def create
    comment = @user_program_workout.workout_comments.build(comment_params)
    if comment.save
      render json: comment, status: :created
    else
      render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /coaches/users/:user_id/user_programs/:user_program_id/user_program_workouts/:user_program_workout_id/workout_comments/:id
  def update
    if @workout_comment.update(comment_params)
      render json: @workout_comment, status: :ok
    else
      render json: { errors: @workout_comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /coaches/users/:user_id/user_programs/:user_program_id/user_program_workouts/:user_program_workout_id/workout_comments/:id
  def destroy
    @workout_comment.destroy
    render json: { message: "Workout comment deleted successfully" }, status: :ok    
  end

  private

  def set_user_program_workout
    @user = User.find(params[:user_id])
    @user_program = @user.user_programs.find(params[:user_program_id])
    @user_program_workout = UserProgramWorkout.find(params[:user_program_workout_id])
  end

  def set_workout_comment
    @workout_comment = @user_program_workout.workout_comments.find(params[:id])
  end

  def comment_params
    params.require(:workout_comment).permit(:content, :timestamp, :user_type)
  end

  def authorize_coach_for_user
    unless @user.coach == current_coach
      render json: { error: 'You are not authorized to access this user\'s workout comments' }, status: :forbidden
    end
  end
end
