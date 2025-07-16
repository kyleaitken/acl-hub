module Coaches 
  class ProgramsController < ApplicationController
    before_action -> { doorkeeper_authorize! :coach }
    # before_action :ensure_current_coach

    # GET /coaches/programs
    def index
      @programs = current_coach.programs.includes(:tags)
      render json: @programs.as_json(include: :tags)
    end

    # GET /coaches/programs/:id
    def show
      @program = current_coach.programs
        .includes(:tags, program_workouts: [:warmup, :cooldown, program_workout_exercises: :exercise])
        .find(params[:id])
    
      render json: @program.as_json(include: {
        tags: {},
        program_workouts: {
          include: {
            warmup: { include: :exercises },
            cooldown: { include: :exercises },
            program_workout_exercises: { include: :exercise }
          }
        }
      })
    end

    def add_tag
      program = current_coach.programs.find(params[:id])
      tag = current_coach.tags.find(params[:tag_id])
      program.tags << tag unless program.tags.include?(tag)
      render json: program, include: :tags
    end
    
    def remove_tag
      program = current_coach.programs.find(params[:id])
      tag = current_coach.tags.find(params[:tag_id])
      program.tags.delete(tag)
      render json: program, include: :tags
    end

    # POST /coaches/programs
    def create
      @program = current_coach.programs.build(program_params)
      if @program.save
        render json: @program, status: :created
      else
        render json: @program.errors, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /coaches/programs/:id
    def update
      @program = current_coach.programs.find(params[:id])
      if @program.update(program_params)
        render json: @program
      else
        render json: @program.errors, status: :unprocessable_entity
      end
    end

    # PATCH /coaches/programs/:id/update_positions
    def update_positions
      @program = current_coach.programs.find(params[:id])
      updates = params[:program_workouts]
      errors = []

      ProgramWorkout.transaction do
        updates.each do |workout_data|
          pw = @program.program_workouts.find(workout_data[:id])
          unless pw.update(workout_data.permit(:day, :week, :order))
            errors << { id: pw.id, errors: pw.errors.full_messages }
          end
        end

        raise ActiveRecord::Rollback if errors.any?
      end

      if errors.any?
        render json: { errors: errors }, status: :unprocessable_entity
      else
        updated_program = @program.reload
          .as_json(include: {
            tags: {},
            program_workouts: {
              include: {
                warmup: { include: :exercises },
                cooldown: { include: :exercises },
                program_workout_exercises: { include: :exercise }
              }
            }
          })
      
        render json: updated_program, status: :ok
      end
    end


    # DELETE /coaches/programs/:id
    def destroy
      @program = current_coach.programs.find(params[:id])
      @program.destroy
      head :no_content
    end

    private

    def program_params
      params.require(:program).permit(:name, :num_weeks, :description)
    end

  end
end