module ProgramWorkouts
  class BulkCopy
    include ActiveModel::Validations

    attr_reader :program, :workout_ids, :target_week, :target_day

    validates :program, :workout_ids, :target_week, :target_day, presence: true

    def initialize(program:, workout_ids:, target_week:, target_day:)
      @program, @workout_ids, @target_week, @target_day = program, workout_ids, target_week, target_day
    end

    def call
      return failure("Invalid parameters") unless valid?

      source   = fetch_source
      base_day = absolute_day(source.first)

      ProgramWorkout.transaction do
        source.each do |orig|
          offset = absolute_day(orig) - base_day
          week, day = map_to_target(offset)
          clone = build_clone(orig, week, day)
          duplicate_exercises(orig, clone)
        end
      end

      success
    rescue => e
      failure(e.message)
    end

    private

    def fetch_source
      program.program_workouts.where(id: workout_ids).order(:week, :day, :order)
    end

    def absolute_day(w)
      (w.week - 1) * 7 + w.day
    end

    def map_to_target(offset)
      idx = ((target_week - 1) * 7 + target_day) + offset
      w0, d0 = (idx - 1).divmod(7)
      [w0 + 1, d0 + 1]
    end

    def build_clone(orig, week, day)
      ord = program.program_workouts.where(week: week, day: day).count
      clone = orig.dup
      clone.week, clone.day, clone.order = week, day, ord
      clone.save!
      clone
    end

    def duplicate_exercises(orig, clone)
      orig.program_workout_exercises.find_each do |pwe|
        clone.program_workout_exercises.create!(
          pwe.attributes.slice("exercise_id", "order", "instructions")
        )
      end
    end

    def success
      OpenStruct.new(success?: true)
    end

    def failure(msg)
      OpenStruct.new(success?: false, errors: [msg])
    end
  end
end
