module Coaches
  module ProgramWorkouts
    class NestedWarmup

      def self.assign!(workout, warmup_id, warmup_attrs, coach)
        if warmup_id.present?
          workout.warmup_id = warmup_id
        elsif warmup_attrs
          workout.warmup_id = nil

          wa = warmup_attrs
                  .merge(coach_id: coach.id, custom: true)
          workout.build_warmup(wa)
        end
      end

    end
  end
end