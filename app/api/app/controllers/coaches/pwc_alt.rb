module Coaches
  class ProgramWorkoutsController < ApplicationController
    before_action ->{ doorkeeper_authorize! :coach }
    before_action :set_program

    def index
      workouts = @program.program_workouts
                .includes(:program_workout_exercises, :warmup, :cooldown)
                .order(:week, :day, :order)
    
      render json: ::ProgramWorkoutSerializer
                     .new(
                       workouts,
                       include: [
                         :warmup,
                         :cooldown,
                         :program_workout_exercises,
                         'program_workout_exercises.exercise',
                         'warmup.exercises',
                         'cooldown.exercises'
                       ]
                     )
                     .serializable_hash
    end

    def show
      workout = @program.program_workouts.find(params[:id])
      render json: ProgramWorkoutSerializer.new(workout).serializable_hash
    end

    def create
      form = ProgramWorkoutForm.new(@program, current_coach, program_workout_params)
      if form.save
        render json: ProgramWorkoutSerializer.new(form.workout).serializable_hash, status: :created
      else
        render json: { errors: form.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      workout = @program.program_workouts.find(params[:id])
      if workout.update(program_workout_params)
        render json: ProgramWorkoutSerializer.new(workout).serializable_hash
      else
        render json: { errors: workout.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @program.program_workouts.find(params[:id]).destroy
      head :no_content
    end

    def destroy_multiple
      @program.program_workouts.where(id: params[:ids]).destroy_all
      head :no_content
    end

    def copy_workouts
      result = ProgramWorkouts::BulkCopy.call(
        program:     @program,
        workout_ids: params[:workout_ids],
        target_week: params[:target_week],
        target_day:  params[:target_day]
      )
      if result.success?
        head :no_content
      else
        render json: { errors: result.errors }, status: :unprocessable_entity
      end
    end

    private

    def set_program
      @program = Program.find(params[:program_id])
    end

    def program_workout_params
      params.require(:program_workout).permit(
        :name, :week, :day, :order,
        :warmup_id, :cooldown_id,
        warmup_attributes:  %i[id name instructions custom coach_id exercise_ids: []],
        cooldown_attributes:%i[id name instructions custom coach_id exercise_ids: []],
        program_workout_exercises_attributes: [
          :id, :exercise_id, :order, :instructions, :_destroy,
          exercise_attributes: %i[id name description video_url custom]
        ]
      )
    end
  end
end
