class Coaches::UsersController < ApplicationController
    include UserWorkoutUtils
    before_action -> { doorkeeper_authorize! :coach }

    # GET /coaches/users
    def index
        @users = current_coach.users 
        render json: @users
    end

    # GET /coaches/users/detailed
    def detailed_index
        @users = current_coach.users.includes(
            user_programs: :user_program_workouts,
            user_outcome_measures: :user_outcome_measure_recordings
        )

        render json: @users.as_json(
            include: {
                user_programs: {
                    include: :user_program_workouts
                },
                user_outcome_measures: {
                    include: :user_outcome_measure_recordings
                }
            }
        )
    end

    def all_user_workouts_today_index
        today = Time.now.in_time_zone('Eastern Time (US & Canada)').to_date
        @users = current_coach.users.includes(user_programs: :user_program_workouts)
        
        response_data = @users.flat_map do |user|
            user.user_programs.flat_map do |program|
            program.user_program_workouts.select { |workout| workout.date == today }.map do |workout|
                {
                user_id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                workout_id: workout.id,
                workout_name: workout.name,
                workout_date: workout.date,
                completed: workout.completed,
                }
            end
            end
        end
        
        render json: response_data
    end

    # GET /coaches/users/updates
    def all_user_updates
        @users = current_coach.users.includes(
            user_programs: {
                user_program_workouts: [
                    :workout_comments, 
                    :user_program_workout_exercises
                ]
            }        
        )   

        response_data = format_updated_user_workouts(@users)
        render json: response_data

    rescue => e
        Rails.logger.error("Error in all_user_updates: #{e.message}")
        render json: { error: e.message }, status: :internal_server_error
    end

    # GET /coaches/users/:id
    def show
        @user = current_coach.users.find_by(id: params[:id])
        if @user
            render json: @user
        else
            render json: { error: 'User not found' }, status: :not_found
        end
    end

    # PUT /coaches/users/:id
    def update
        @user = current_coach.users.find_by(id: params[:id])
        if @user
            if @user.update(user_update_params)
                render json: { user: @user, message: 'User updated successfully.' }, status: :ok
            else
                render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
            end
        else
            render json: { error: 'User not found' }, status: :not_found
        end
    end

    private

    def user_update_params
        params.require(:user).permit(:active)
    end
end
