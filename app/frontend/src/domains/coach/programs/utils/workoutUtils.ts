import { RawWorkoutData, WorkoutCardItem, ExerciseStackItem } from "../types/ui";
import { Exercise } from "../../libraries/features/exercises/types";

function equalExercises(
  original: WorkoutCardItem["program_workout_exercises"],
  form: ExerciseStackItem[]
) {
  if (original.length !== form.length) return false;

  for (let i = 0; i < original.length; i++) {
    const x = original[i];
    const y = form[i];

    // must still be the same DB record
    if (x.id !== y.programWorkoutExerciseId) return false;

    // order must match
    if (x.order !== y.order) return false;

    // same exercise name (custom vs library is already baked into programWorkoutExercise)
    if (x.exercise.name !== y.name) return false;

    // same instructions
    if (x.instructions !== y.instructions) return false;
  }

  return true;
}

function equalRoutineExercises(a: Exercise[], b: Exercise[]) {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i].id !== b[i].id) return false;
  }

  return true;
}

/**
 * Compare an existing workouts data to the form data to see if there are changes
 *   1. workout name
 *   2. warmup instructions + exercise sequence
 *   3. cooldown instructions + exercise sequence
 *   4. main exercise stack (order/id/name/instructions)
 */
export function workoutDataEqual(
  original: WorkoutCardItem,
  form: RawWorkoutData
): boolean {
  // 1) name
  if (original.name !== form.name) return false;

  // 2) warmup
  if (original.warmup?.instructions !== form.warmupInstructions) return false;
  if (!equalRoutineExercises(original.warmup?.exercises ?? [], form.warmupExercises)) {
    return false;
  }

  // 3) cooldown
  if (original.cooldown?.instructions !== form.cooldownInstructions) return false;
  if (
    !equalRoutineExercises(original.cooldown?.exercises ?? [], form.cooldownExercises)
  ) {
    return false;
  }

  // 4) main stack
  if (!equalExercises(original.program_workout_exercises, form.exercisesStack)) {
    return false;
  }

  return true;
}

export const recalculateExerciseOrders = (arr: ExerciseStackItem[]) =>
  arr.map((it, i) => ({ ...it, order: String.fromCharCode(65 + i) }));

export const sortExercisesByOrder = <T extends { order?: string }>(a: T, b: T) =>
  String(a.order ?? "").localeCompare(String(b.order ?? ""), undefined, {
    sensitivity: "base",
});