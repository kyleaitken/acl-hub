 module Coaches 
  module ProgramWorkouts
    class CreateProgramWorkout
      include ::Callable 

      def initialize(coach, program, attrs)
        @coach, @program, @attrs = coach, program, attrs
      end

      def call
        workout = @program.program_workouts.build
        assign_nested!(workout)
        if workout.save
          Success(workout: workout)
        else
          Failure(errors: workout.errors.full_messages)
        end
      end

      private

      def assign_nested!(workout)
        NestedWarmup.assign!(workout, @attrs[:warmup_id], @attrs.delete(:warmup_attributes), @coach)
        NestedCooldown.assign!(workout, @attrs[:cooldown_id], @attrs.delete(:cooldown_attributes), @coach)
        NestedExercises.assign!(workout, @attrs.delete(:program_workout_exercises_attributes))
        workout.assign_attributes(@attrs.slice(:name, :day, :week, :order))
      end
    end
  end
end