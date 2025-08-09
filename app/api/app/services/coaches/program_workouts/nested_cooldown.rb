module Coaches    
  module ProgramWorkouts
    class NestedCooldown
      include ::Callable

      def self.assign!(workout, cooldown_id, cooldown_attrs, coach)
        if cooldown_id.present?
          workout.cooldown_id = cooldown_id
        elsif cooldown_attrs
          workout.cooldown_id = nil

          cd = cooldown_attrs.merge(coach_id: coach.id, custom: true)
          workout.build_cooldown(cd)
        end
      end
    end
  end
end