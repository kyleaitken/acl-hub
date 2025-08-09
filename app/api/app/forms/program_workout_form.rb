class ProgramWorkoutForm
  include ActiveModel::Model

  attr_reader :program, :coach, :workout, :params

  def initialize(program, coach, params)
    @program, @coach, @params = program, coach, params
    @workout = program.program_workouts.build
  end

  def save
    assign_attributes
    sanitize_nested
    workout.save
  end

  delegate :errors, to: :workout

  private

  def assign_attributes
    workout.assign_attributes(params)
  end

  def sanitize_nested
    if workout.warmup&.custom?
      workout.warmup.coach = coach
    end
    if workout.cooldown&.custom?
      workout.cooldown.coach = coach
    end

    workout.program_workout_exercises.each do |pwe|
      next unless ex_attr = pwe.exercise_attributes
      unless Exercise.find(ex_attr[:id]).custom?
        pwe.exercise_attributes.delete(:id)
        pwe.exercise_id = nil
      end
    end
  end
end
