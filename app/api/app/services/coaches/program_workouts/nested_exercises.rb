module Coaches   
  module ProgramWorkouts
    class NestedExercises
      include ::Callable

      def self.assign!(workout, entries)
        workout.program_workout_exercises.destroy_all if entries.blank?
        entries.each do |entry|
          pwe = if entry[:id] then
            workout.program_workout_exercises.detect { |w| w.id == entry[:id] }
          else
            workout.program_workout_exercises.build
          end

          if entry.delete(:_destroy)
            pwe.mark_for_destruction
            next
          end

          if nested = entry.delete(:exercise_attributes)
            if nested[:id].present? && Exercise.find(nested[:id]).custom?
              pwe.exercise.update(nested)
            else
              pwe.build_exercise(nested)
            end
          elsif entry[:exercise_id]
            pwe.exercise_id = entry[:exercise_id]
          end

          pwe.assign_attributes(entry.slice(:order, :instructions))
        end
      end
    end
  end
end