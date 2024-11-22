module UserWorkoutUtils
  def format_updated_user_workouts(users)
    users.flat_map do |user|
      user.user_programs.flat_map do |program|
        program.user_program_workouts.filter(&:updated).map do |workout|
          {
            user_id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            workout: format_workout(workout)
          }
        end
      end
    end
  end

  def format_workout(workout)
    {
      id: workout.id,
      programId: workout.user_program_id,
      date: workout.date,
      day: workout.day,
      week: workout.week,
      name: workout.name,
      comment: workout.comment,
      warmup: workout.warmup,
      completed: workout.completed,
      updated: workout.updated,
      order: workout.order,
      exercises: format_exercises(workout.user_program_workout_exercises.includes(:exercise))
    }
  end

  def format_exercises(exercises)
    exercises.map do |exercise|
      {
        id: exercise.id,
        exerciseId: exercise.exercise_id,
        order: exercise.order,
        instructions: exercise.instructions,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        duration: exercise.duration,
        hold: exercise.hold,
        completed: exercise.completed,
        results: exercise.results,
        name: exercise.exercise.name 
      }
    end
  end
end
