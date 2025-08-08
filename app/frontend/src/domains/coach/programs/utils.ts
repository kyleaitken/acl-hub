import { Exercise } from '../libraries/features/exercises/types'
import { RoutineType } from '../libraries/features/routines/types'
import {
  CreateNewProgramWorkoutPayload,
  WorkoutStackItem,
  CreateFormItem,
  EditFormItem,
  WorkoutCardItem,
  CreateWorkoutExerciseAttributes,
  UpdateProgramWorkoutPayload,
  UpdateWorkoutExerciseAttributes,
  UpdateExistingProgramWorkoutExercise,
} from './types'
import { RawWorkoutData } from './types'

/*
  Builds the payload for createing a new workout in a program
*/
export function buildNewWorkoutPayload(
  raw: RawWorkoutData,
  week?: number,
  day?: number,
  order?: number
): CreateNewProgramWorkoutPayload {
  const {
    name,
    warmupId,
    warmupInstructions,
    warmupExercises,
    cooldownId,
    cooldownInstructions,
    cooldownExercises,
    exercisesStack
  } = raw

  const warmup_attrs = warmupId == null
    ? { instructions: warmupInstructions, exercise_ids: warmupExercises.map((ex) => ex.id), custom: true }
    : undefined

  const cooldown_attrs = cooldownId == null
    ? { instructions: cooldownInstructions, exercise_ids: cooldownExercises.map((ex) => ex.id), custom: true }
    : undefined

  const exercises = exercisesStack.map<CreateWorkoutExerciseAttributes>((ex) => {
    const base = {
      order: ex.order,
      instructions: ex.instructions,
    }
    return ex.exerciseId
    ? { ...base, exercise_id: ex.exerciseId }
    : { ...base, exercise_attributes: { name: ex.name!, custom: true } }
  })

  const payload: CreateNewProgramWorkoutPayload = {
    name,
    warmup_id: warmupId,
    warmup_attributes: warmup_attrs,
    cooldown_id: cooldownId,
    cooldown_attributes: cooldown_attrs,
    program_workout_exercises_attributes: exercises,
  };

  // Only add week/day/order if they are defined (for create)
  if (week !== undefined) payload.week = week;
  if (day !== undefined) payload.day = day;
  if (order !== undefined) payload.order = order;

  return payload;
}

/*
  Builds the payload for updating an existing workout in a program
*/
export function buildUpdateWorkoutPayload(
  raw: RawWorkoutData
): UpdateProgramWorkoutPayload {

  const exercises = raw.exercisesStack.map<UpdateWorkoutExerciseAttributes>(ex => {
    const baseWorkoutExerciseData = {
      order: ex.order,
      instructions: ex.instructions
    }

    // editing an existing workout exercise
    if (ex.programWorkoutExerciseId) {
      const baseExistingExeriseData = {
        ...baseWorkoutExerciseData,
        id: ex.programWorkoutExerciseId
      }

      // if has an exerciseId, keep that id and update metadata if needed
      // otherwise create a new custom exercise
      return ex.exerciseId
        ? { 
            exercise_id: ex.exerciseId,
            ...baseExistingExeriseData
          }
        : {
          exercise_attributes: { name: ex.name, custom: true },
          ...baseExistingExeriseData
        } 
    }

    /*
      No Workout Exercise ID - 2 conditions:
      1) has an exerciseId - adding a new exercise from library, should create a pwe with that exerciseId
      2) no exerciseId - creating a new pwe with a custom exercise
    */
    return ex.exerciseId
      ? {
          exercise_id: ex.exerciseId,
          ...baseWorkoutExerciseData
        }
      : {
          exercise_attributes: { name: ex.name, custom: true },
          ...baseWorkoutExerciseData
        }  
  });

  const deletes: UpdateExistingProgramWorkoutExercise[] =
    raw.deletedWorkoutExerciseIds.map(id => ({ id, _destroy: true }));

  const warmup_attrs = raw.warmupId == null
    ? { instructions: raw.warmupInstructions, exercise_ids: raw.warmupExercises.map((ex) => ex.id), custom: true }
    : undefined

  const cooldown_attrs = raw.cooldownId == null
    ? { instructions: raw.cooldownInstructions, exercise_ids: raw.cooldownExercises.map((ex) => ex.id), custom: true }
    : undefined

  return {
    name: raw.name,
    warmup_id: raw.warmupId,
    warmup_attributes: warmup_attrs,
    cooldown_id: raw.cooldownId,
    cooldown_attributes: cooldown_attrs,
    program_workout_exercises_attributes: [
      ...exercises,
      ...deletes
    ],
  };
}


export function isCardItem(x: WorkoutStackItem): x is WorkoutCardItem {
  return x.__type === "card";
}

export function isCreateForm(x: WorkoutStackItem): x is CreateFormItem {
  return x.__type === "form" && x.mode === "create";
}

export function isEditForm(x: WorkoutStackItem): x is EditFormItem {
  return x.__type === "form" && x.mode === "edit";
}

export function mapWorkoutCardToRawFormData(card: WorkoutCardItem): RawWorkoutData {
  const { __type, program_workout_exercises: pwes, ...w } = card
  return {
    name: w.name ?? "",
    workoutId: w.id,
    warmupId: w.warmup_id ?? undefined,
    warmupInstructions: w.warmup?.instructions ?? "",
    warmupExercises: w.warmup?.exercises ?? [],
    isCustomWarmup: w.warmup?.custom ?? true,
    cooldownId: w.cooldown_id ?? undefined,
    cooldownInstructions: w.cooldown?.instructions ?? "",
    cooldownExercises: w.cooldown?.exercises ?? [],
    isCustomCooldown: w.cooldown?.custom ?? true,
    exercisesStack: pwes.map((pwe) => ({
      programWorkoutExerciseId: pwe.id,
      name: pwe.exercise.name,
      instructions: pwe.instructions ?? "",
      order: pwe.order,
      exerciseId: pwe.exercise.id,
      videoUrl: pwe.exercise.video_url,
    })),
    deletedWorkoutExerciseIds: []
  };
}


interface RoutineUpdatePayload {
  instructions?: string;
  exercises?: Exercise[];
  isCustom?: boolean;
  id?: number;
}

/* 
  Updates the raw workout data in the WorkoutForm based on the routine type (warmup or cooldown)
  and the provided payload containing new instructions, exercises, id, and custom flag. If it's
  a not a custom routine and we make any changes (eg delete/add exercises, or change instructions)
  then it gets flipped to a custom routine and we clear the id.
*/
export function updateRoutineData(
  prev: RawWorkoutData,
  type: RoutineType,
  payload: RoutineUpdatePayload
): RawWorkoutData {
  const isWarmup = type === "warmup";
  const wasCustom = isWarmup ? prev.isCustomWarmup : prev.isCustomCooldown;

  let idToSet: number | undefined;
  
  if (payload.id !== undefined) {
    // If payload provides an id, always use it
    idToSet = payload.id;
  } else if (wasCustom) {
    // If it was custom before, keep existing id
    idToSet = isWarmup ? prev.warmupId : prev.cooldownId;
  } else {
    // Previously non-custom but now changed -> clear the id
    idToSet = undefined;
  }

  return {
    ...prev,
    ...(isWarmup
      ? {
          warmupId: idToSet,
          warmupInstructions: payload.instructions ?? prev.warmupInstructions,
          warmupExercises: payload.exercises ?? prev.warmupExercises,
          isCustomWarmup: payload.isCustom ?? true,
        }
      : {
          cooldownId: idToSet,
          cooldownInstructions: payload.instructions ?? prev.cooldownInstructions,
          cooldownExercises: payload.exercises ?? prev.cooldownExercises,
          isCustomCooldown: payload.isCustom ?? true,
        }),
  };
}
