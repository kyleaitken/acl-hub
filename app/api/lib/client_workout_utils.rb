module ClientWorkoutUtils
  def format_updated_client_workouts(clients)
    clients.flat_map do |client|
      client.client_programs.flat_map do |program|
        program.client_program_workouts.filter(&:updated).map do |workout|
          {
            client_id: client.id,
            first_name: client.first_name,
            last_name: client.last_name,
            workout: format_workout(workout)
          }
        end
      end
    end
  end


  def format_comments(comments)
    comments.map do |comment|
      {
        id: comment.id,
        content: comment.content,
        timestamp: comment.created_at,
        user_type: comment.user_type
      }
    end
  end

  def format_workout(workout)
    {
      id: workout.id,
      programId: workout.client_program_id,
      date: workout.date,
      day: workout.day,
      week: workout.week,
      name: workout.name,
      warmup: workout.warmup,
      completed: workout.completed,
      updated: workout.updated,
      order: workout.order,
      comments: format_comments(workout.workout_comments),
      exercises: format_exercises(workout.client_program_workout_exercises.includes(:exercise))
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
