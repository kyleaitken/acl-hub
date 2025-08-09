# app/services/copy_program_workouts.rb
module Coaches
  module ProgramWorkouts
    class CopyProgramWorkouts
      include ::Callable

      def initialize(coach, program, opts)
        @coach = coach
        @program = program
        @ids       = Array(opts[:workout_ids]).map(&:to_i)
        @target_w  = opts[:target_week].to_i
        @target_d  = opts[:target_day].to_i
      end

      def call
        source = @program.program_workouts
                        .where(id: @ids)
                        .order(:week, :day, :order)
                        .to_a

        return Failure(errors: ["No workouts to copy"]) if source.empty?

        base_day    = day_of_program(source.first)
        new_workouts =
          ProgramWorkout.transaction do
            source.map do |orig|
              new_week, new_day = map_to_target_week_day(day_of_program(orig) - base_day)
              clone = build_clone(orig, new_week, new_day)
              duplicate_exercises(orig, clone)
              clone
            end.tap do |clones|
              bump_weeks_if_needed!(clones)
            end
          end

        Success(payload: {
          program:  { id: @program.id, num_weeks: @program.num_weeks },
          workouts: new_workouts.map { |w| ProgramWorkoutSerializer.serialize(w) }
        })
      end

      private

      def day_of_program(w)
        (w.week - 1) * 7 + w.day
      end

      def map_to_target_week_day(offset)
        target_index = ((@target_w - 1) * 7 + @target_d) + offset
        week_zero, day_zero = (target_index - 1).divmod(7)
        [week_zero + 1, day_zero + 1]
      end

      def build_clone(orig, week, day)
        clone = orig.dup
        clone.week, clone.day, clone.order = week, day, @program.program_workouts.where(week: week, day: day).count
        clone.save!
      
        if orig.warmup&.custom?
          # deep-clone the custom warmup
          new_warmup = orig.warmup.dup
          new_warmup.coach_id = @coach.id
          new_warmup.save!
          # clone its exercises links (they’re library exercises, so just join them)
          new_warmup.exercise_ids = orig.warmup.exercise_ids
          clone.warmup = new_warmup
        else
          clone.warmup_id = orig.warmup_id
        end
      
        if orig.cooldown&.custom?
          new_cd = orig.cooldown.dup
          new_cd.coach_id = @coach.id
          new_cd.save!
          new_cd.exercise_ids = orig.cooldown.exercise_ids
          clone.cooldown = new_cd
        else
          clone.cooldown_id = orig.cooldown_id
        end
      
        clone.save!
        clone
      end
      
      def duplicate_exercises(orig, clone)
        orig.program_workout_exercises.each do |pwe|
          if pwe.exercise.custom?
            # make a new custom exercise
            new_ex = pwe.exercise.dup
            new_ex.save!
            clone.program_workout_exercises.create!(
              exercise:      new_ex,
              order:         pwe.order,
              instructions:  pwe.instructions
            )
          else
            # library exercise – just link by ID
            clone.program_workout_exercises.create!(
              exercise_id:  pwe.exercise_id,
              order:        pwe.order,
              instructions: pwe.instructions
            )
          end
        end
      end

      def bump_weeks_if_needed!(clones)
        max_week = clones.map(&:week).max
        @program.update!(num_weeks: max_week) if max_week > @program.num_weeks
      end

    end
  end
end