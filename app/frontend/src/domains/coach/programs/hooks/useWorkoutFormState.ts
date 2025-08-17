import { useCallback, useEffect, useMemo, useState } from "react";
import { ExerciseStackItem, RawWorkoutData, WorkoutCardItem } from "../types/ui";
import { FormModeType } from "../components/WorkoutForm";
import { mapWorkoutCardToRawFormData, updateRoutineData } from "../utils";
import { Exercise } from "../../libraries/features/exercises/types";
import { DetailedRoutine, LibraryRoutine, RoutineType } from "../../libraries/features/routines/types";
import { useWarmupsActions } from "../../libraries/features/routines/hooks/useWarmupsActions";
import { useCooldownsActions } from "../../libraries/features/routines/hooks/useCooldownsActions";
import toast from "react-hot-toast";
import { recalculateExerciseOrders, workoutDataEqual } from "../utils/workoutUtils";
import { useRoutineSearchTriggers } from "./useRoutineSearchTriggers";

const initialExerciseStack = [{
  name: '',
  instructions: '',
  order: 'A',
  _key: crypto.randomUUID()
}];

const initialRawData: RawWorkoutData = {
  name: '',
  workoutId: undefined,
  warmupId: undefined,
  warmupInstructions: '',
  warmupExercises: [],
  isCustomWarmup: true,
  cooldownId: undefined,
  cooldownInstructions: '',
  cooldownExercises: [],
  isCustomCooldown: true,
  exercisesStack: initialExerciseStack,
  deletedWorkoutExerciseIds: []
};

export const useWorkoutFormState = (mode: FormModeType, existingCard?: WorkoutCardItem) => {
  const initial = useMemo(
    () => (mode === "edit" && existingCard ? mapWorkoutCardToRawFormData(existingCard) : initialRawData),
    [mode, existingCard?.id]
  );

  const [rawData, setRawData] = useState<RawWorkoutData>(initial);
  const [hasChanges, setHasChanges] = useState(false);

  const { addWarmup, fetchDetailedWarmup } = useWarmupsActions();
  const { addCooldown, fetchDetailedCooldown } = useCooldownsActions();
  const { 
    warmupSearchResults, 
    cooldownSearchResults 
  } = useRoutineSearchTriggers(rawData.warmupInstructions, rawData.cooldownInstructions);

  /*
    Effects
  */
  useEffect(() => {
    if (mode !== "edit" || !existingCard) return;
    setHasChanges(!workoutDataEqual(existingCard, rawData))
  }, [rawData])

  // Workout
  const changeWorkoutName = (newName: string) => {
    setRawData((prev) => ({...prev, name: newName}));
  }

  /*
    Exercises
  */
  const addLibraryExerciseToStack = (ex: Exercise, idx: number) => {
    setRawData(prev => ({
      ...prev,
      exercisesStack: prev.exercisesStack.map((item, i) => 
        i === idx
          ? { 
              ...item, 
              exerciseId: ex.id, 
              name: ex.name, 
              videoUrl: ex.video_url
            }
          : item
      )
    }))
  };

  const addNewEmptyExerciseToStack = () => {
    const lastItem = rawData.exercisesStack[rawData.exercisesStack.length - 1];
    const lastOrder = lastItem.order;
    const newOrder = String.fromCharCode(lastOrder.charCodeAt(0) + 1);

    const newItem = {
      name: '',
      instructions: '',
      order: newOrder,
      tempId: crypto.randomUUID()
    }

    setRawData(prev => ({
      ...prev,
      exercisesStack: [...prev.exercisesStack, newItem]
    }))
  }

    // When a user edits an exercise name, it clears the previous 
  // exerciseId from the stack, since it's a new/different exercise - will create a new custom one if left as is
  const changeExerciseName = (idx: number, newName: string) => {
    setRawData(prev => ({
      ...prev,
      exercisesStack: prev.exercisesStack.map((item, i) =>
        i === idx
          ? { ...item, name: newName, exerciseId: undefined, videoUrl: undefined }
          : item
      )
    }))
  }
  
  const changeExerciseInstructions = (idx: number, newInst: string) => {
    setRawData(prev => ({
      ...prev,
      exercisesStack: prev.exercisesStack.map((item, i) =>
        i === idx
          ? { ...item, instructions: newInst }
          : item
      )
    }))
  }

  const removeExerciseFromWorkout = (idx: number) => {
    setRawData(prev => {
      const removed = prev.exercisesStack[idx];
      return {
        ...prev,
        deletedWorkoutExerciseIds: removed.programWorkoutExerciseId 
          ? [...prev.deletedWorkoutExerciseIds, removed.programWorkoutExerciseId] 
          : prev.deletedWorkoutExerciseIds,
        exercisesStack: prev.exercisesStack
          .filter((_, i) => i !== idx)
          .map((item, i) => ({ ...item, order: String.fromCharCode(65 + i) })),
      };
    });
  };

  const setNewlySavedExercise = (ex: Exercise, idx: number) => {
    setRawData(prev => ({
      ...prev,
      exercisesStack: prev.exercisesStack.map((item, i) =>
        i === idx
          ? { ...item, exerciseId: ex.id, videoUrl: ex.video_url }
          : item
      )
    }))
  }

  const reorderExercisesStack = useCallback(
    (next: ExerciseStackItem[] | ((prev: ExerciseStackItem[]) => ExerciseStackItem[])) => {
      setRawData(prev => {
        const nextArray =
          typeof next === "function"
            ? (next as (p: ExerciseStackItem[]) => ExerciseStackItem[])(prev.exercisesStack)
            : next;

        return {
          ...prev,
          exercisesStack: recalculateExerciseOrders(nextArray),
        };
      });
    },
    []
  );

  /*
    Routines
  */
  const addLibraryRoutineToWorkout = async (
    type: RoutineType,
    routine: LibraryRoutine
  ) => {
    try {
      let detailedRoutine: DetailedRoutine | null = null;
  
      if (type === "warmup") {
        detailedRoutine = await fetchDetailedWarmup(routine.id);
      } else {
        detailedRoutine = await fetchDetailedCooldown(routine.id);
      }
  
      if (!detailedRoutine) {
        throw new Error("Could not fetch detailed routine");
      }

      setRawData((prev) =>
        updateRoutineData(prev, type, {
          isCustom: false,
          id: detailedRoutine.id,
          instructions: detailedRoutine.instructions,
          exercises: detailedRoutine.exercises
        })
      )
  
    } catch (err) {
      console.error("Failed to load routine:", err);
      toast.error(`Failed to load full ${type} routine`);
    }
  };

  const saveRoutineToLibrary = async ( type: RoutineType, name: string, instructions: string, exerciseIds: number[]) => {
    try {
      const added = type === "warmup"
        ? await addWarmup({ name, instructions, exerciseIds })
        : await addCooldown({ name, instructions, exerciseIds });

      setRawData((prev) =>
        updateRoutineData(prev, type, { id: added.id, isCustom: false })
      );

      toast.success(`${type} saved!`);
    } catch (err) {
      console.error(`Error while trying to save ${type}: `, err);
      toast.error(`Unable to save ${type}.`);
    }
  };

  const removeExerciseFromRoutine = (type: RoutineType, exercise: Exercise) => {
    setRawData((prev) =>
      updateRoutineData(prev, type, {
        exercises: type === "warmup"
          ? prev.warmupExercises.filter((item) => item.id !== exercise.id)
          : prev.cooldownExercises.filter((item) => item.id !== exercise.id)
      })
    );
  };

  const addExerciseToRoutine = ( type: RoutineType, exercise: Exercise) => {
    setRawData((prev) => 
      updateRoutineData(prev, type, {
        exercises: type === "warmup" 
          ? [...prev.warmupExercises, exercise]
          : [...prev.cooldownExercises, exercise],
      })
    );
  };

  const changeRoutineInstructions = (type: RoutineType, newValue: string) => {
    setRawData((prev) =>
      updateRoutineData(prev, type, {
        instructions: newValue,
      })
    );
  };

  const hasEmptyExercises = rawData.exercisesStack.some(item => item.name.trim() === "")

  return {
    // data
    rawData,
    hasChanges,
    hasEmptyExercises,
    warmupSearchResults,
    cooldownSearchResults,
    setRawData,
    changeWorkoutName,

    // exercise actions
    addLibraryExerciseToStack,
    addNewEmptyExerciseToStack,
    changeExerciseName,
    changeExerciseInstructions,
    removeExerciseFromWorkout,
    setNewlySavedExercise,
    reorderExercisesStack,

    // routine actions
    addLibraryRoutineToWorkout,
    saveRoutineToLibrary,
    removeExerciseFromRoutine,
    addExerciseToRoutine,
    changeRoutineInstructions
  }
  

};