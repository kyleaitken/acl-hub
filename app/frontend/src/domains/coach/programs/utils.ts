import { Exercise } from '../libraries/features/exercises/types'
import { RoutineType } from '../libraries/features/routines/types'
import {
  CreateNewProgramWorkoutPayload,
  UpdateProgramWorkoutPayload,
  ProgramWorkoutExerciseAttrs,
  DeletePWE,
  UpdatePWE,
  CreateFromLibrary,
  CreateNewCustom
} from './types/payloads'
import { 
  WorkoutStackItem,
  CreateFormItem,
  EditFormItem,
  WorkoutCardItem,
  RawWorkoutData,
} from './types/ui'

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

  const exercises = exercisesStack.map<ProgramWorkoutExerciseAttrs>((ex) => {
    const base = { order: ex.order, instructions: ex.instructions }

    if (ex.exerciseId != null) {
      return { ...base, exercise_id: ex.exerciseId };
    } else {
      return {
        ...base,
        exercise_attributes: { name: ex.name!, custom: true }
      };
    }
  })

  const warmupPart = warmupId != null
    ? { warmup_id: warmupId }
    : {
        warmup_attributes: {
          instructions: warmupInstructions,
          exercise_ids: warmupExercises.map(e => e.id),
          custom: true
        }
      };

  const cooldownPart = cooldownId != null
    ? { cooldown_id: cooldownId }
    : {
        cooldown_attributes: {
          instructions: cooldownInstructions,
          exercise_ids: cooldownExercises.map(e => e.id),
          custom: true
        }
      };

  return {
    name,
    ...warmupPart,
    ...cooldownPart,
    program_workout_exercises_attributes: exercises,
    ...(week !== undefined && { week }),
    ...(day  !== undefined && { day  }),
    ...(order!== undefined && { order })
  };
}

/*
  Builds the payload for updating an existing workout in a program
*/
export function buildUpdateWorkoutPayload(raw: RawWorkoutData): UpdateProgramWorkoutPayload {
  const exercises: ProgramWorkoutExerciseAttrs[] = []

  raw.exercisesStack.forEach(ex => {
    const base = { order: ex.order, instructions: ex.instructions };

    if (ex.programWorkoutExerciseId != null) {
      if (ex.exerciseId != null) {

        exercises.push({
          ...base,
          id: ex.programWorkoutExerciseId,
          exercise_id: ex.exerciseId,
        } as UpdatePWE)

      } else {

        exercises.push({
          ...base,
          id: ex.programWorkoutExerciseId,
          exercise_attributes: { name: ex.name!, custom: true }
        } as UpdatePWE)
      }
    } else {
      if (ex.exerciseId != null) {

        exercises.push({
          ...base,
          exercise_id: ex.exerciseId
        } as CreateFromLibrary)

      } else {

        exercises.push({
          ...base,
          exercise_attributes: { name: ex.name!, custom: true }
        } as CreateNewCustom)
      }
    }
  });

  for (const id of raw.deletedWorkoutExerciseIds) {
    exercises.push({
      id,
      order: "__unused__",    
      instructions: "__unused__",
      _destroy: true
    } as DeletePWE)
  }

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
    program_workout_exercises_attributes: exercises
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
      customExercise: pwe.exercise.custom,
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

  let idToSet: number | undefined;
  
  if (payload.id !== null) {
    idToSet = payload.id;
  } else {
    // making an edit, clear the id/create a new one (custom or not)
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