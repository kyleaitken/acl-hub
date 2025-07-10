class Coaches::WorkoutCommentsController < ApplicationController
  before_action -> { doorkeeper_authorize! :coach }
  before_action :set_client_program_workout
  before_action :set_workout_comment, only: [:update, :destroy]
  before_action :authorize_coach_for_client

  # POST /coaches/clients/:client_id/client_programs/:client_program_id/client_program_workouts/:client_program_workout_id/workout_comments
  def create
    comment = @client_program_workout.workout_comments.build(comment_params)
    if comment.save
      render json: comment, status: :created
    else
      render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /coaches/clients/:client_id/client_programs/:client_program_id/client_program_workouts/:client_program_workout_id/workout_comments/:id
  def update
    if @workout_comment.update(comment_params)
      render json: @workout_comment, status: :ok
    else
      render json: { errors: @workout_comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /coaches/clients/:client_id/client_programs/:client_program_id/client_program_workouts/:client_program_workout_id/workout_comments/:id
  def destroy
    @workout_comment.destroy
    render json: { message: "Workout comment deleted successfully" }, status: :ok    
  end

  private

  def set_client_program_workout
    @client = Client.find(params[:client_id])
    @client_program = @client.client_programs.find(params[:client_program_id])
    @client_program_workout = ClientProgramWorkout.find(params[:client_program_workout_id])
  end

  def set_workout_comment
    @workout_comment = @client_program_workout.workout_comments.find(params[:id])
  end

  def comment_params
    params.require(:workout_comment).permit(:content, :timestamp, :user_type)
  end

  def authorize_coach_for_client
    unless @client.coach == current_coach
      render json: { error: 'You are not authorized to access this client\'s workout comments' }, status: :forbidden
    end
  end
end
