class ProgramWorkoutSerializer
  def self.serialize(workout)
    workout.as_json(
      include: {
        program_workout_exercises: { include: :exercise },
        warmup:  { include: :exercises },
        cooldown: { include: :exercises }
      }
    )
  end
end