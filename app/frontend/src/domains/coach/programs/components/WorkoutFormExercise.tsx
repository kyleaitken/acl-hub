import { useEffect, useRef, forwardRef, useState, useImperativeHandle } from "react";
import ExerciseSearchResults from "../../libraries/features/exercises/components/ExerciseSearchResults";
import { useExerciseSearch } from "../../libraries/features/exercises/hooks/useExerciseSearch";
import { useOutsideClickDismiss } from "../../core/hooks/useOutsideClickDismiss";
import { TextareaAutosize } from "@mui/material";
import VideocamIcon from '@mui/icons-material/Videocam';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { Exercise } from "../../libraries/features/exercises/types";
import ExercisePreview from "../../libraries/features/exercises/components/ExercisePreview";
import { getEmbedUrl } from "../../core/utils/text";
import AddNewExerciseDialog from "./AddNewExerciseDialog";
import { useDisableScroll } from "../../core/hooks/useDisableScroll";
import { ExerciseStackItem } from "../types/ui";
import OpenWithIcon from '@mui/icons-material/OpenWith';
import { ConfirmDeleteButton } from "../../core/components/ConfirmDeleteButton";
import TooltipIconButton from "../../core/components/TooltipIconButton";

interface WorkoutFormExerciseProps {
  stackIndex: number;
  stackSize: number;
  exerciseItem: ExerciseStackItem;
  onAddLibraryExercise: (exercise: Exercise, stackIndex: number) => void;
  addNewlySavedExerciseToWorkout: (ex: Exercise, idx: number) => void;
  onNameChange: (newName: string) => void;
  onInstructionsChange: (newInst: string) => void;
  removeExerciseFromWorkout: (index: number) => void;
}

const WorkoutFormExercise = forwardRef<HTMLTextAreaElement | null, WorkoutFormExerciseProps>(
  (props, ref) => {
    const {
      stackIndex,
      stackSize,
      exerciseItem,
      onAddLibraryExercise,
      onNameChange,
      onInstructionsChange,
      addNewlySavedExerciseToWorkout,
      removeExerciseFromWorkout,
    } = props;
    
  const [isSearching, setIsSearching] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSaveExerciseDialog, setShowSaveExerciseDialog] = useState(false);

  const searchRef = useRef<HTMLDivElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const instrRef      = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const { results: searchResults, search } = useExerciseSearch();
  useDisableScroll(showSaveExerciseDialog);

  useOutsideClickDismiss([searchRef], () => {
    setIsSearching(false);
  });

  useEffect(() => {
    if (!isSearching) return;
    if (exerciseItem.name.length < 3) {
      return;
    }

    const h = setTimeout(() => {
      search(exerciseItem.name);
    }, 250);

    return () => clearTimeout(h);
  }, [exerciseItem.name]);

  const handleSelectExercise = (ex: Exercise) => {
    setIsSearching(false);           
    onAddLibraryExercise(ex, stackIndex);
    titleInputRef.current?.blur();
    instrRef.current?.focus();
  };  

  useImperativeHandle<HTMLTextAreaElement, HTMLTextAreaElement>(ref, () => instrRef.current!, []);

  const anchorRect = buttonRef.current ? buttonRef.current.getBoundingClientRect() : null;

  return (
    <div className="flex flex-col px-3">
      <div
        className="absolute -left-7 -top-2 z-10 flex flex-col space-y-0
                  bg-[#242526]/90 px-2 py-1 rounded-xl
                  opacity-0 group-hover:opacity-100 transition-opacity"
        hidden={stackSize === 1}
      >
        <div className="exercise-drag-handle cursor-pointer">
          <button
            type="button"
            className="pointer-events-none"
            aria-label="Drag to reorder"
          >
            <OpenWithIcon sx={{ color: 'white', fontSize: 18 }} />
          </button>
        </div>
        <ConfirmDeleteButton
          tooltipText="Delete workout item"
          confirmText="Delete this workout item?"
          onDeleteConfirmed={() => removeExerciseFromWorkout(stackIndex)}
          iconSize={18}
          iconColor="white"
          buttonClassName="p-0"
          tooltipOffset={10}
        />
      </div>
      <div ref={searchRef} className="flex relative">
        <div className="flex items-center text-[13px] flex-1 mr-1 pt-1">
          <span className="font-semibold mr-1">{`${exerciseItem.order})`}</span>
          <input
            ref={titleInputRef}
            placeholder="Exercise title (required)"
            className="outline-none font-semibold w-full"
            value={exerciseItem.name}
            onChange={e => {
              onNameChange(e.target.value);
              setIsSearching(true);
            }}
          />
          {isSearching && exerciseItem.name.length > 2 && searchResults.length > 0 && (
            <ExerciseSearchResults
              searchResults={searchResults}
              searchString={exerciseItem.name}
              handleAddExercise={ex => {
                handleSelectExercise(ex);
              }}
              onEscape={() => setIsSearching(false)}
            />
          )}
        </div>

        {(exerciseItem.videoUrl) ?
        <div
          ref={buttonRef}
        >
          <TooltipIconButton
            tooltipContent="Open exercise preview"
            onClick={() => setShowPreview(true)}
            aria-label="Show exercise preview"
            buttonClassName="p-0 cursor-pointer"
            placementOffset={0}
          >
            <VideocamIcon sx={{ fontSize: 20}} />
          </TooltipIconButton>
        </div>
        : (!exerciseItem.exerciseId && exerciseItem.name.length > 2) ?
        <div
          ref={buttonRef}
        >
          <TooltipIconButton
            tooltipContent="Create new library exercise"
            onClick={() => setShowSaveExerciseDialog(true)}
            aria-label="Create new library exercise"
            buttonClassName={"cursor-pointer p-0"}
            placementOffset={0}
          >
            <VideoCallIcon sx={{ fontSize: 22, color: '#5e748b'}} />
          </TooltipIconButton>
        </div>
        : <></>
        }

        {showPreview && anchorRect && exerciseItem.exerciseId && (
        <ExercisePreview 
            anchorRect={anchorRect}
            name={exerciseItem.name}
            url={getEmbedUrl(exerciseItem.videoUrl || '')}
            exerciseId={exerciseItem.exerciseId}
            handleDismissPreview={() => setShowPreview(false)}
          />
        )}

        {showSaveExerciseDialog && anchorRect &&
        <AddNewExerciseDialog
          anchorRect={anchorRect}
          handleDismiss={() => setShowSaveExerciseDialog(false)}
          onSaveExercise={(ex: Exercise) => addNewlySavedExerciseToWorkout(ex, stackIndex)}
          title={exerciseItem.name}
        />
        }
      </div>
      <div id="workout-form-exercise-inst" >
        <TextareaAutosize
          ref={instrRef}
          minRows={2}
          maxRows={3}
          placeholder="Sets Reps Tempo Rest etc"
          value={exerciseItem.instructions}
          onChange={(e) => onInstructionsChange(e.target.value)}
          className="text-[11px] border-0 outline-none w-full resize-none my-1"
        />
      </div>
    </div>
  )
});

export default WorkoutFormExercise;


