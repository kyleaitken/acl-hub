import { useEffect, useState } from "react";
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import WorkoutFormExercise from "./WorkoutFormExercise";
import DeleteIcon from '@mui/icons-material/Delete';
import WorkoutFormWarmupOrCooldown from "./WorkoutFormWarmupOrCooldown";
import { LibraryWarmupOrCooldown } from "../../libraries/features/routines/types";
import { useWarmupsSearch } from "../../libraries/features/routines/hooks/useWarmupsSearch";
import { useCooldownsSearch } from "../../libraries/features/routines/hooks/useCooldownsSearch";
import { useWarmupsActions } from "../../libraries/features/routines/hooks/useWarmupsActions";
import { useCooldownsActions } from "../../libraries/features/routines/hooks/useCooldownsActions";
import toast from "react-hot-toast";
import { RawWorkoutData } from "../types";
import { Exercise } from "../../libraries/features/exercises/types";
import TooltipIconButton from "../../core/components/TooltipIconButton";

const initialExerciseStack = [{
  name: '',
  instructions: '',
  order: 'A',
}];

const initialRawData: RawWorkoutData = {
  name: '',
  warmupId: undefined,
  warmupInstructions: '',
  warmupExerciseIds: [],
  cooldownId: undefined,
  cooldownInstructions: '',
  cooldownExerciseIds: [],
  exercisesStack: initialExerciseStack
};

interface WorkoutFormProps {
  initialData?: {}; // when updating an existing workout, fill the form with the initial data 
  existingExercise: boolean;
  handleCancelCreate: (stackIndex: number) => void;
  handleAddNewWorkout: (rawData: RawWorkoutData) => void;
  stackIndex: number;
}

const WorkoutForm = ({initialData, stackIndex, existingExercise, handleCancelCreate, handleAddNewWorkout}: WorkoutFormProps) => {
  const [rawData, setRawData] = useState<RawWorkoutData>(initialRawData);

  const { warmupSearchResults, searchWarmups } = useWarmupsSearch();
  const { cooldownSearchResults, searchCooldowns } = useCooldownsSearch();
  const { addWarmup } = useWarmupsActions();
  const { addCooldown } = useCooldownsActions();

  // Disable save until there's at least one exercise 
  const saveButtonDisabled = !rawData.exercisesStack.every(
    item => item.name.trim() !== ""
  )

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

  const handleAddExerciseIdToStackItem = (ex: Exercise, idx: number) => {
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

  const handleAddNewExerciseToStack = () => {
    const lastItem = rawData.exercisesStack[rawData.exercisesStack.length - 1];
    const lastOrder = lastItem.order;
    const newOrder = String.fromCharCode(lastOrder.charCodeAt(0) + 1);

    const newItem = {
      name: '',
      instructions: '',
      order: newOrder
    }

    setRawData(prev => ({
      ...prev,
      exercisesStack: [...prev.exercisesStack, newItem]
    }))
  }

  const handleClearExerciseFromStackItem = (stackIndex: number) => {
    setRawData(prev => ({
      ...prev,
      exercisesStack: prev.exercisesStack.map((item, i) => 
        i === stackIndex
          ? { ...item, exerciseId: undefined}
          : item
      )
    }))
  }

  const handleAddExistingRoutineToWorkout = (
    type: "warmup" | "cooldown",
    routine: LibraryWarmupOrCooldown
  ) => {
    console.log('adding routine', routine)
    setRawData(prev => ({
      ...prev,
      ...(type === "warmup"
        ? {
            warmupId: routine.id,
            warmupInstructions: routine.instructions ?? "",
            warmupExerciseIds: routine.exerciseIds ?? []
          }
        : {
            cooldownId: routine.id,
            cooldownInstructions: routine.instructions ?? "",
            cooldownExerciseIds: routine.exerciseIds ?? []
          }
      )
    }));
  };

  const handleRemoveExerciseFromRoutine = (type: "warmup" | "cooldown", idToRemove: number) => {
    setRawData(prev => ({
      ...prev,
      warmupExerciseIds: type === "warmup" ? prev.warmupExerciseIds.filter((item) => item !== idToRemove) : prev.warmupExerciseIds,
      cooldownExerciseIds: type === "cooldown" ? prev.cooldownExerciseIds.filter((item) => item !== idToRemove) : prev.cooldownExerciseIds,
    }));
  }

  const handleAddExerciseToRoutine = ( type: "warmup" | "cooldown", idToAdd: number) => {
    setRawData(prev => ({
      ...prev,
      warmupExerciseIds: type === "warmup" ? [...prev.warmupExerciseIds, idToAdd] : prev.warmupExerciseIds,
      cooldownExerciseIds: type === "cooldown" ? [...prev.cooldownExerciseIds, idToAdd] : prev.cooldownExerciseIds,
    }));
  }

  const handleSaveRoutineToLibrary = async ( type: "warmup" | "cooldown", name: string, instructions: string, exerciseIds: number[]) => {
    try {
      const added = type === "warmup"
        ? await addWarmup({ name, instructions, exerciseIds })
        : await addCooldown({ name, instructions, exerciseIds });

      setRawData(prev => ({
        ...prev,
        ...(type === "warmup"
          ? { warmupId: added.id }
          : { cooldownId: added.id })
      }));

      toast.success(`${type} saved!`);
    } catch (err) {
      console.error(`Error while trying to save ${type}: `, err);
      toast.error(`Unable to save ${type}.`);
    }
  };

  const handleChangeRoutineInstructions = (type: "warmup" | "cooldown", newValue: string) => {
    setRawData(prev => ({
      ...prev, 
      warmupId:     type === "warmup"   ? undefined : prev.warmupId,
      warmupInstructions: type === "warmup" ? newValue   : prev.warmupInstructions,
      cooldownId:   type === "cooldown" ? undefined : prev.cooldownId,
      cooldownInstructions: type === "cooldown" ? newValue : prev.cooldownInstructions,
    }));
  }

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

  const handleSetNewlyAddedExercise = (ex: Exercise, idx: number) => {
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
      const newStack = rawData.exercisesStack.filter((_, i) => i !== idx);

      const reOrdered = newStack.map((item, i) => ({
        ...item,
        order: String.fromCharCode("A".charCodeAt(0) + i),
      }));

      return {
        ...prev,
        exercisesStack: reOrdered,
      };
    })
  };

  return (
    <form
      className="mb-5 border-2 py-2 border-red-500 shadow-md bg-white w-[350px]"
    >
      <div id="workout-form-header" className="flex items-center mb-3 px-3">
        <input
          type="text"
          placeholder="Name (optional)"
          value={rawData.name}
          onChange={(e) => setRawData(prev => ({...prev, name: e.target.value}))}
          className="outline-none font-semibold flex-1"
        />
        <button><OpenInFullIcon/></button>
        <button><BatteryChargingFullIcon/></button>
      </div>

      <WorkoutFormWarmupOrCooldown
        type="warmup"
        addRoutineFromLibrary={handleAddExistingRoutineToWorkout}
        routineSegmentSearchResults={warmupSearchResults}
        instructions={rawData.warmupInstructions}
        onChange={handleChangeRoutineInstructions}
        exerciseIds={rawData.warmupExerciseIds}
        removeExerciseFromRoutine={handleRemoveExerciseFromRoutine}
        addExerciseToRoutine={handleAddExerciseToRoutine}
        saveRoutineToLibrary={handleSaveRoutineToLibrary}
      />

      <div className="divider my-4 w-full border-t border-gray-500" />
      {rawData.exercisesStack.map((ex, i) => {
        const stackLength = rawData.exercisesStack.length;
        const isLast = i === stackLength - 1;
        return (
          <div key={i}>
            <WorkoutFormExercise
              exerciseItem={ex}
              stackIndex={i}
              stackSize={stackLength}
              addExerciseToStackItem={handleAddExerciseIdToStackItem}
              clearExerciseFromStackItem={handleClearExerciseFromStackItem}
              onNameChange={(name) => handleExerciseNameChange(i, name)}
              onInstructionsChange={(inst) => handleExerciseInstructionsChange(i, inst)}
              setNewlyAddedExercise={handleSetNewlyAddedExercise}
              removeExerciseFromWorkout={handleRemoveExerciseFromWorkout}
            />
            <div className="relative">
              <div className="divider w-full border-t border-gray-400 mb-2" />
              {isLast && (
                <button
                  type="button"
                  onClick={handleAddNewExerciseToStack}
                  className="absolute left-1/2 -translate-x-1/2 -top-3 text-xs border-1 rounded-md cursor-pointer bg-white px-2 py-1"
                >
                  + Add Exercise
                </button>
              )}
            </div>
          </div>
        )
      })}

      <WorkoutFormWarmupOrCooldown
        type="cooldown"
        addRoutineFromLibrary={handleAddExistingRoutineToWorkout}
        routineSegmentSearchResults={cooldownSearchResults}
        instructions={rawData.cooldownInstructions}
        onChange={handleChangeRoutineInstructions}
        exerciseIds={rawData.cooldownExerciseIds}
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
            className="rounded bg-[#4e4eff] text-white text-sm px-2 py-1 cursor-pointer mr-2 hover:bg-blue-800
              disabled:opacity-50 
              disabled:cursor-not-allowed 
            "
            onClick={() => handleAddNewWorkout(rawData)}
            disabled={saveButtonDisabled}
          >
            Save
          </button>
          <button
            type="button"
            className="rounded bg-white text-sm px-2 py-1 cursor-pointer mr-2 hover:bg-gray-200"
            onClick={() => handleCancelCreate(stackIndex)}
          >
            Cancel
          </button>
        </div>
        {!existingExercise &&
        <TooltipIconButton 
          title="Delete workout"
          aria-label="Delete workout"
          buttonClassName={"cursor-pointer"}
          tooltipPosition="top"
        >
          <DeleteIcon sx={{color: '#545454', cursor: 'pointer'}}/>
        </TooltipIconButton>
        }
      </div>
    </form>
  );
};

export default WorkoutForm;
