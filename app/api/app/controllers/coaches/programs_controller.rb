module Coaches
  class ProgramsController < ApplicationController
    before_action -> { doorkeeper_authorize! :coach }

    PROGRAM_JSON_INCLUDES = {
      tags: {},
      program_workouts: {
        include: {
          warmup:   { include: :exercises },
          cooldown: { include: :exercises },
          program_workout_exercises: { include: :exercise }
        }
      }
    }.freeze

    # GET /coaches/programs
    def index
      programs = current_coach.programs.includes(:tags)
      render json: programs.as_json(include: :tags)
    end

    # GET /coaches/programs/:id
    def show
      program = current_coach.programs
        .includes(:tags, program_workouts: [:warmup, :cooldown, program_workout_exercises: :exercise])
        .find(params[:id])
  
      render_program(program)
    end

    # POST /coaches/programs
    def create
      result = Coaches::Programs::CreateProgram.call(current_coach, program_params)
      if result[:success]
        render json: result[:program], status: :created
      else
        render json: { errors: result[:errors] }, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /coaches/programs/:id
    def update
      result = Coaches::Programs::UpdateProgram.call(current_coach, params[:id], program_params)
      if result[:success]
        render json: result[:program]
      else
        render json: { errors: result[:errors] }, status: :unprocessable_entity
      end
    end

    # PATCH /coaches/programs/:id/update_positions
    def update_positions
      result = Coaches::Programs::UpdateWorkoutPositions.call(current_coach, params[:id], params[:program_workouts])
      if result[:success]
        render_program(result[:program].reload)
      else
        render json: { errors: result[:errors] }, status: :unprocessable_entity
      end
    end

    # POST /coaches/programs/:id/add_tag
    def add_tag
      result = Coaches::Programs::AddTag.call(current_coach, params[:id], params[:tag_id])
      if result[:success]
        render json: result[:program], include: :tags
      else
        render json: { errors: result[:errors] }, status: :unprocessable_entity
      end
    end

    # DELETE /coaches/programs/:id/remove_tag
    def remove_tag
      result = Coaches::Programs::RemoveTag.call(current_coach, params[:id], params[:tag_id])
      if result[:success]
        render json: result[:program], include: :tags
      else
        render json: { errors: result[:errors] }, status: :unprocessable_entity
      end
    end

    # DELETE /coaches/programs/:id
    def destroy
      current_coach.programs.find(params[:id]).destroy
      head :no_content
    end

    # DELETE /coaches/programs/:id/delete_week/:week_num
    def delete_week
      result = Coaches::Programs::DeleteWeek.call(current_coach, params[:id], params[:week_num])
      if result[:success]
        render_program(result[:program].reload)
      else
        render json: { errors: result.errors }, status: :unprocessable_entity
      end
    end

    private

    def program_params
      params.require(:program).permit(:name, :num_weeks, :description)
    end

    def render_program(program)
      render json: program.as_json(include: PROGRAM_JSON_INCLUDES)
    end

  end
end
