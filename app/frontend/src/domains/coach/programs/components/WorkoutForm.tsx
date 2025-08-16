import { SetStateAction, useEffect, useRef, useState } from "react";
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import WorkoutFormExercise from "./WorkoutFormExercise";
import WorkoutFormWarmupOrCooldown from "./WorkoutFormWarmupOrCooldown";
import { DetailedRoutine, LibraryRoutine, RoutineType } from "../../libraries/features/routines/types";
import { useWarmupsSearch } from "../../libraries/features/routines/hooks/useWarmupsSearch";
import { useCooldownsSearch } from "../../libraries/features/routines/hooks/useCooldownsSearch";
import { useWarmupsActions } from "../../libraries/features/routines/hooks/useWarmupsActions";
import { useCooldownsActions } from "../../libraries/features/routines/hooks/useCooldownsActions";
import toast from "react-hot-toast";
import { ExerciseStackItem, RawWorkoutData, WorkoutCardItem } from "../types/ui";
import { Exercise } from "../../libraries/features/exercises/types";
import { mapWorkoutCardToRawFormData, updateRoutineData } from "../utils";
import { workoutDataEqual } from "../utils/workoutDataEqual";
import { useOutsideClickDismiss } from "../../core/hooks/useOutsideClickDismiss";
import { ConfirmDeleteButton } from "../../core/components/ConfirmDeleteButton";
import ConfirmModal from "../../core/components/ConfirmModal";
import { dragAndDrop } from '@formkit/drag-and-drop/react';

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

interface WorkoutFormProps {
  mode: "create" | "edit";
  stackIndex: number;
  existingCard?: WorkoutCardItem;
  focusExerciseIndex?: number | null;
  onCancel: (index: number) => void;
  onSave: (raw: RawWorkoutData) => void;
  isSaving: boolean;
  onDelete?: (id: number, index: number) => void;
}

const WorkoutForm = ({
  mode, 
  stackIndex, 
  existingCard, 
  focusExerciseIndex, 
  isSaving,
  onCancel, 
  onSave, 
  onDelete}: WorkoutFormProps) => {
    
  const originalRaw: RawWorkoutData =
  mode === 'edit' && existingCard
    ? mapWorkoutCardToRawFormData(existingCard)
    : initialRawData;

  const originalRef = useRef<RawWorkoutData>(originalRaw);

  const [rawData, setRawData] = useState<RawWorkoutData>(originalRef.current)
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const { warmupSearchResults, searchWarmups } = useWarmupsSearch();
  const { cooldownSearchResults, searchCooldowns } = useCooldownsSearch();
  const { addWarmup, fetchDetailedWarmup } = useWarmupsActions();
  const { addCooldown, fetchDetailedCooldown } = useCooldownsActions();

  const titleRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const deleteButtonRef = useRef<HTMLDivElement>(null);
  const exerciseRefs = useRef<Array<HTMLTextAreaElement | null>>([]);

  useOutsideClickDismiss([formRef], () => {
    if (isSaveDisabled) {
      onCancel(stackIndex);
    } else {
      onSave(rawData);
    }
  });

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !existingCard) return;
    setHasChanges(!workoutDataEqual(existingCard, rawData))
  }, [rawData])

  // Warmup search results
  useEffect(() => {
    if (rawData.warmupInstructions.length < 3) {
      return;
    }

    const h = setTimeout(() => {
      searchWarmups(rawData.warmupInstructions);
    }, 250);

    return () => clearTimeout(h);
  }, [rawData.warmupInstructions]);

  // Cooldown search results
  useEffect(() => {
    if (rawData.cooldownInstructions.length < 3) {
      return;
    }

    const h = setTimeout(() => {
      searchCooldowns(rawData.cooldownInstructions);
    }, 250);

    return () => clearTimeout(h);
  }, [rawData.cooldownInstructions]);

  const handleAddLibraryExerciseToStack = (ex: Exercise, idx: number) => {
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

  const handleAddNewEmptyExerciseToStack = () => {
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

  const handleAddLibraryRoutineToWorkout = async (
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

  const handleRemoveExerciseFromRoutine = (type: RoutineType, exercise: Exercise) => {
    setRawData((prev) =>
      updateRoutineData(prev, type, {
        exercises: type === "warmup"
          ? prev.warmupExercises.filter((item) => item.id !== exercise.id)
          : prev.cooldownExercises.filter((item) => item.id !== exercise.id)
      })
    );
  };

  const handleAddExerciseToRoutine = ( type: RoutineType, exercise: Exercise) => {
    setRawData((prev) => 
      updateRoutineData(prev, type, {
        exercises: type === "warmup" 
          ? [...prev.warmupExercises, exercise]
          : [...prev.cooldownExercises, exercise],
      })
    );
  };

  const handleSaveRoutineToLibrary = async ( type: RoutineType, name: string, instructions: string, exerciseIds: number[]) => {
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

  const handleChangeRoutineInstructions = (type: RoutineType, newValue: string) => {
    setRawData((prev) =>
      updateRoutineData(prev, type, {
        instructions: newValue,
      })
    );
  };

  // When a user edits an exercise name, it clears the previous 
  // exerciseId from the stack, since it's a new/different exercise - will create a new custom one if left as is
  const handleExerciseNameChange = (idx: number, newName: string) => {
    setRawData(prev => ({
      ...prev,
      exercisesStack: prev.exercisesStack.map((item, i) =>
        i === idx
          ? { ...item, name: newName, exerciseId: undefined, videoUrl: undefined }
          : item
      )
    }))
  }
  
  const handleExerciseInstructionsChange = (idx: number, newInst: string) => {
    setRawData(prev => ({
      ...prev,
      exercisesStack: prev.exercisesStack.map((item, i) =>
        i === idx
          ? { ...item, instructions: newInst }
          : item
      )
    }))
  }

  const handleSetNewlySavedExercise = (ex: Exercise, idx: number) => {
    setRawData(prev => ({
      ...prev,
      exercisesStack: prev.exercisesStack.map((item, i) =>
        i === idx
          ? { ...item, exerciseId: ex.id, videoUrl: ex.video_url }
          : item
      )
    }))
  }

  const handleRemoveExerciseFromWorkout = (idx: number) => {
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

  const handleDeleteWorkoutClicked = (id: number) => {
    if (onDelete) onDelete(id, stackIndex);
  }

  const isExercisesStackEmpty = rawData.exercisesStack.every(item => item.name.trim() === "")
  const isSaveDisabled =
    isSaving ||
    isExercisesStackEmpty ||
    (mode === "edit" && !hasChanges)

  
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current) return;
  
    dragAndDrop<HTMLDivElement, ExerciseStackItem>({
      parent: listRef,  
      state: [
        rawData.exercisesStack,
        (next: SetStateAction<ExerciseStackItem[]>) => {
          setRawData(prev => {
            const nextArray =
              typeof next === 'function'
                ? (next as (p: ExerciseStackItem[]) => ExerciseStackItem[])(prev.exercisesStack)
                : next;
  
            return {
              ...prev,
              exercisesStack: relabel(nextArray),
            };
          });
        },
      ],  
      dragHandle: ".exercise-drag-handle",
      draggingClass: "border-1 bg-white py-2 opacity-70",
      dragPlaceholderClass: "opacity-30",
    });
  }, [rawData.exercisesStack]);

  const relabel = (items: ExerciseStackItem[]) =>
    items.map((it, i) => ({ ...it, order: String.fromCharCode(65 + i) })); 

  useEffect(() => {
    if (focusExerciseIndex != null) {
      const el = exerciseRefs.current[focusExerciseIndex];
      if (el) {
        el.focus();
        const len = el.value.length;
        el.setSelectionRange(len, len);
      }

    } else {
      titleRef.current?.focus();
    }
  }, [focusExerciseIndex]);

  return (
    <form
      className="mb-5 border-2 py-2 border-blue-500 shadow-md bg-white w-[280px]"
      ref={formRef}
    >
      <div id="workout-form-header" className="flex items-center mb-3 px-3">
        <input
          ref={titleRef}
          type="text"
          placeholder="Name (optional)"
          value={rawData.name}
          onChange={(e) => setRawData(prev => ({...prev, name: e.target.value}))}
          className="text-[14px] outline-none font-semibold flex-1"
        />
        <button type="button" className="cursor-pointer"><OpenInFullIcon sx={{fontSize: 18}}/></button>
      </div>

      <WorkoutFormWarmupOrCooldown
        type="warmup"
        addRoutineFromLibrary={handleAddLibraryRoutineToWorkout}
        routineSegmentSearchResults={warmupSearchResults}
        instructions={rawData.warmupInstructions}
        onChange={handleChangeRoutineInstructions}
        exercises={rawData.warmupExercises}
        removeExerciseFromRoutine={handleRemoveExerciseFromRoutine}
        addExerciseToRoutine={handleAddExerciseToRoutine}
        saveRoutineToLibrary={handleSaveRoutineToLibrary}
      />

      <div className="divider my-2 w-full border-t border-gray-500"/>
      <div ref={listRef}>
        {rawData.exercisesStack.map((ex, i) => {
          const stackLength = rawData.exercisesStack.length;
          const isLast = i === stackLength - 1;
          return (
            <div key={ex.tempId ?? ex.programWorkoutExerciseId} className="exercise-row group select-none relative">
              <WorkoutFormExercise
                ref={(el) => (exerciseRefs.current[i] = el)}
                exerciseItem={ex}
                stackIndex={i}
                stackSize={stackLength}
                onAddLibraryExercise={handleAddLibraryExerciseToStack}
                onNameChange={(name) => handleExerciseNameChange(i, name)}
                onInstructionsChange={(inst) => handleExerciseInstructionsChange(i, inst)}
                addNewlySavedExerciseToWorkout={handleSetNewlySavedExercise}
                removeExerciseFromWorkout={handleRemoveExerciseFromWorkout}
              />
              <div className="relative">
                <div className="divider w-full border-t border-gray-400 mb-2" />
                {isLast && (
                  <button
                    type="button"
                    onClick={handleAddNewEmptyExerciseToStack}
                    className="text-[10px] absolute left-1/2 -translate-x-1/2 -top-2 border-1 rounded-md cursor-pointer bg-white px-1 py-1 hover:bg-gray-100"
                  >
                    + Add Exercise
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <WorkoutFormWarmupOrCooldown
        type="cooldown"
        addRoutineFromLibrary={handleAddLibraryRoutineToWorkout}
        routineSegmentSearchResults={cooldownSearchResults}
        instructions={rawData.cooldownInstructions}
        onChange={handleChangeRoutineInstructions}
        exercises={rawData.cooldownExercises}
        removeExerciseFromRoutine={handleRemoveExerciseFromRoutine}
        addExerciseToRoutine={handleAddExerciseToRoutine}
        saveRoutineToLibrary={handleSaveRoutineToLibrary}
      />

      <div className="divider my-4 w-full border-t border-gray-500" />
      <div
        className="flex px-3 my-2" 
      >
        <div className="flex flex-1">
          <button
            type="button"
            className="text-xs rounded bg-[var(--blue-button)] text-white px-2 py-1 cursor-pointer mr-2 hover:bg-blue-800
              disabled:opacity-50 
              disabled:cursor-not-allowed 
            "
            onClick={() => onSave(rawData)}
            disabled={isSaveDisabled}
          >
            Save
          </button>
          <button
            type="button"
            className="text-xs rounded bg-white px-2 py-1 cursor-pointer mr-2 hover:bg-gray-200"
            onClick={() => {
              (!isSaveDisabled) ? setShowConfirmCancel(true) : onCancel(stackIndex)
            }}
          >
            Cancel
          </button>
        </div>
        {existingCard !== undefined &&
          <div
            ref={deleteButtonRef}
            className='relative'
          >
            <ConfirmDeleteButton
              tooltipText="Delete workout"
              confirmText="Delete workout from the program?"
              onDeleteConfirmed={() => handleDeleteWorkoutClicked(existingCard.id)}
              iconSize={20}
              buttonClassName="py-1"
            />
          </div>
        }
      </div>
      {isSaving && 
      <p className="px-3 py-1 text-sm">Saving...</p>
      }
      {showConfirmCancel && (
        <ConfirmModal
          title="Discard changes to this workout?"
          confirmButtonText="Discard Changes"
          cancelButtonText="Never mind"
          confirmHandler={() => onCancel(stackIndex)}
          cancelHandler={() => setShowConfirmCancel(false)}
          isDanger={true}
        />
      )}
    </form>
  );
};

export default WorkoutForm;
