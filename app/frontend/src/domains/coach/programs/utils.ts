import {
  ProgramWorkoutPayload,
  ProgramWorkoutExerciseAttributes,
} from './types'
import { RawWorkoutData } from './types'

export function buildWorkoutPayload(
  raw: RawWorkoutData,
  week: number,
  day: number,
  order: number
): ProgramWorkoutPayload {
  const {
    name,
    warmupId,
    warmupInstructions,
    warmupExerciseIds,
    cooldownId,
    cooldownInstructions,
    cooldownExerciseIds,
    exercisesStack
  } = raw

  const warmup_attrs = warmupId == null
    ? { instructions: warmupInstructions, exercise_ids: warmupExerciseIds, custom: true }
    : undefined

  const cooldown_attrs = cooldownId == null
    ? { instructions: cooldownInstructions, exercise_ids: cooldownExerciseIds, custom: true }
    : undefined

  const exercises = exercisesStack.map<ProgramWorkoutExerciseAttributes>(ex =>
    ex.exerciseId
      ? { exercise_id: ex.exerciseId, order: ex.order, instructions: ex.instructions }
      : {
          order: ex.order,
          instructions: ex.instructions,
          exercise_attributes: { name: ex.name!, custom: true }
        }
  )

  return {
    name,
    week,
    day,
    order,
    warmup_id: warmupId,
    warmup_attributes: warmup_attrs,
    cooldown_id: cooldownId,
    cooldown_attributes: cooldown_attrs,
    program_workout_exercises_attributes: exercises
  }
}
