class Coaches::ClientsController < ApplicationController
    include ClientWorkoutUtils
    before_action -> { doorkeeper_authorize! :coach }

    # GET /coaches/clients
    def index
        @clients = current_coach.clients 
        render json: @clients
    end

    # GET /coaches/clients/detailed
    def detailed_index
        @clients = current_coach.clients.includes(
            client_programs: :client_program_workouts,
            client_outcome_measures: :client_outcome_measure_recordings
        )

        render json: @clients.as_json(
            include: {
                client_programs: {
                    include: :client_program_workouts
                },
                client_outcome_measures: {
                    include: :client_outcome_measure_recordings
                }
            }
        )
    end

    def all_client_workouts_today_index
        today = Time.now.in_time_zone('Eastern Time (US & Canada)').to_date
        @clients = current_coach.clients.includes(client_programs: :client_program_workouts)
        
        response_data = @clients.flat_map do |client|
            client.client_programs.flat_map do |program|
            program.client_program_workouts.select { |workout| workout.date == today }.map do |workout|
                {
                client_id: client.id,
                first_name: client.first_name,
                last_name: client.last_name,
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

    # GET /coaches/clients/updates
    def all_client_updates
        @clients = current_coach.clients.includes(
            client_programs: {
                client_program_workouts: [
                    :workout_comments, 
                    :client_program_workout_exercises
                ]
            }        
        )   

        response_data = format_updated_client_workouts(@clients)
        render json: response_data

    rescue => e
        Rails.logger.error("Error in all_client_updates: #{e.message}")
        render json: { error: e.message }, status: :internal_server_error
    end

    # GET /coaches/clients/:id
    def show
        @client = current_coach.clients.find_by(id: params[:id])
        if @client
            render json: @client
        else
            render json: { error: 'client not found' }, status: :not_found
        end
    end

    # PUT /coaches/clients/:id
    def update
        @client = current_coach.clients.find_by(id: params[:id])
        if @client
            if @client.update(client_update_params)
                render json: { client: @client, message: 'Client updated successfully.' }, status: :ok
            else
                render json: { errors: @client.errors.full_messages }, status: :unprocessable_entity
            end
        else
            render json: { error: 'Client not found' }, status: :not_found
        end
    end

    private

    def client_update_params
        params.require(:client).permit(:active)
    end
end
