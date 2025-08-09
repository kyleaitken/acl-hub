module Coaches
  module ProgramWorkouts
    class UpdateProgramWorkout
      include ::CoreServices::Callable

      def initialize(coach, program, id, attrs)
        @coach, @program, @id, @attrs = coach, program, id, attrs
      end

      def call
        workout = @program.program_workouts.find(@id)

        # 1) stash the old routine IDs
        old_warmup_id   = workout.warmup_id
        old_cooldown_id = workout.cooldown_id

        # 2) stash old exercise-ids for exercise cleanup
        old_eids = workout.program_workout_exercises.pluck(:exercise_id)

        assign_nested!(workout)

        if workout.save
          # 3a) delete orphaned PWEs/exercises
          cleanup_orphan_exercises(old_eids, workout)

          # 3b) delete the old warmup/cooldown if they went away
          cleanup_orphan_routines(old_warmup_id, workout.warmup_id, Warmup)
          cleanup_orphan_routines(old_cooldown_id, workout.cooldown_id, Cooldown)

          Success(workout: workout)
        else
          Failure(errors: workout.errors.full_messages)
        end
      end

      private

      def assign_nested!(workout)
        NestedWarmup.assign!( workout,
                              @attrs[:warmup_id],
                              @attrs.delete(:warmup_attributes),
                              @coach)

        NestedCooldown.assign!( workout,
                                @attrs[:cooldown_id],
                                @attrs.delete(:cooldown_attributes),
                                @coach)

        NestedExercises.assign!( workout,
                                 @attrs.delete(:program_workout_exercises_attributes))

        workout.assign_attributes(@attrs.slice(:name, :day, :week, :order))
      end

      def cleanup_orphan_exercises(old_eids, workout)
        removed = old_eids - workout.program_workout_exercises.pluck(:exercise_id)
        Exercise.where(id: removed, custom: true).destroy_all
      end

      def cleanup_orphan_routines(old_id, new_id, klass)
        return if old_id.blank? || old_id == new_id
        old = klass.find_by(id: old_id)
        if old&.custom? && old.program_workouts.reload.empty?
          old.destroy
        end
      end
    end
  end
end
