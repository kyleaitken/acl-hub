import { useEffect, useRef, useState } from "react";
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import WorkoutFormExercise from "./WorkoutFormExercise";
import WorkoutFormWarmupOrCooldown from "./WorkoutFormWarmupOrCooldown";
import { RawWorkoutData, WorkoutCardItem } from "../types/ui";
import { useOutsideClickDismiss } from "../../core/hooks/useOutsideClickDismiss";
import { ConfirmDeleteButton } from "../../core/components/ConfirmDeleteButton";
import ConfirmModal from "../../core/components/ConfirmModal";
import { useWorkoutFormState } from "../hooks/useWorkoutFormState";
import { useExerciseDragAndDrop } from "../hooks/useExerciseDragAndDrop";

export type FormModeType = "edit" | "create";

interface WorkoutFormProps {
  mode: FormModeType;
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
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  const { 
    // data
    rawData, 
    hasChanges,
    hasEmptyExercises,
    warmupSearchResults,
    cooldownSearchResults,
    changeWorkoutName,

    // exercises
    addLibraryExerciseToStack, 
    addNewEmptyExerciseToStack,
    changeExerciseInstructions,
    changeExerciseName,
    removeExerciseFromWorkout,
    setNewlySavedExercise,
    reorderExercisesStack,

    // routines
    addLibraryRoutineToWorkout,
    saveRoutineToLibrary,
    removeExerciseFromRoutine,
    addExerciseToRoutine,
    changeRoutineInstructions
  } = useWorkoutFormState(mode, existingCard);

  const titleRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const deleteButtonRef = useRef<HTMLDivElement>(null);
  const exerciseRefs = useRef<Array<HTMLTextAreaElement | null>>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useExerciseDragAndDrop(listRef, rawData.exercisesStack, reorderExercisesStack);

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

  const handleDeleteWorkoutClicked = (id: number) => {
    if (onDelete) onDelete(id, stackIndex);
  }

  const isSaveDisabled =
    isSaving ||
    hasEmptyExercises ||
    (mode === "edit" && !hasChanges)

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
          onChange={(e) => changeWorkoutName(e.target.value)}
          className="text-[14px] outline-none font-semibold flex-1"
        />
        <button type="button" className="cursor-pointer"><OpenInFullIcon sx={{fontSize: 18}}/></button>
      </div>

      <WorkoutFormWarmupOrCooldown
        type="warmup"
        addRoutineFromLibrary={addLibraryRoutineToWorkout}
        routineSegmentSearchResults={warmupSearchResults}
        instructions={rawData.warmupInstructions}
        onChange={changeRoutineInstructions}
        exercises={rawData.warmupExercises}
        removeExerciseFromRoutine={removeExerciseFromRoutine}
        addExerciseToRoutine={addExerciseToRoutine}
        saveRoutineToLibrary={saveRoutineToLibrary}
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
                onAddLibraryExercise={addLibraryExerciseToStack}
                onNameChange={(name) => changeExerciseName(i, name)}
                onInstructionsChange={(inst) => changeExerciseInstructions(i, inst)}
                addNewlySavedExerciseToWorkout={setNewlySavedExercise}
                removeExerciseFromWorkout={removeExerciseFromWorkout}
              />
              <div className="relative">
                <div className="divider w-full border-t border-gray-400 mb-2" />
                {isLast && (
                  <button
                    type="button"
                    onClick={addNewEmptyExerciseToStack}
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
        addRoutineFromLibrary={addLibraryRoutineToWorkout}
        routineSegmentSearchResults={cooldownSearchResults}
        instructions={rawData.cooldownInstructions}
        onChange={changeRoutineInstructions}
        exercises={rawData.cooldownExercises}
        removeExerciseFromRoutine={removeExerciseFromRoutine}
        addExerciseToRoutine={addExerciseToRoutine}
        saveRoutineToLibrary={saveRoutineToLibrary}
      />

      <div className="divider my-4 w-full border-t border-gray-500" />

      <div
        className="workout-form-buttons flex px-3 my-2" 
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
              dialogClassName="-left-40"
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
