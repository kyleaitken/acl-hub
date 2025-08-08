import { useEffect, useRef, useState } from "react";
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
import { ExerciseStackItem } from "../types";
import DeleteIcon from '@mui/icons-material/Delete';
import OpenWithIcon from '@mui/icons-material/OpenWith';

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

const WorkoutFormExercise = ({
  stackIndex,
  stackSize,
  exerciseItem, 
  onAddLibraryExercise, 
  onNameChange,
  onInstructionsChange,
  addNewlySavedExerciseToWorkout,
  removeExerciseFromWorkout,
}: WorkoutFormExerciseProps) => {
  const [hovered, setHovered] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSaveExerciseDialog, setShowSaveExerciseDialog] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
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

  const anchorRect = buttonRef.current ? buttonRef.current.getBoundingClientRect() : null;

  return (
    <div 
      className="flex flex-col px-3 relative"
      ref={containerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && stackSize !== 1 && (
        <div
          className="flex flex-col absolute -left-5 -top-1 justify-center space-y-2 bg-[#242526]/90 px-1 py-3 rounded"
        >
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => removeExerciseFromWorkout(stackIndex)}
          >
            <DeleteIcon sx={{color: 'white', fontSize: '20px'}}/>
          </button>
          <button
            className="cursor-pointer"
          >
            <OpenWithIcon sx={{color: 'white', fontSize: '20px'}}/>
          </button>
        </div>
      )}
      <div ref={searchRef} className="flex relative">
        <div className="flex items-center text-[15px] flex-1">
          <span className="font-semibold mr-1">{`${exerciseItem.order})`}</span>
          <input
            ref={titleInputRef}
            placeholder="Exercise title (required)"
            className=" outline-none font-semibold w-full"
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
            />
          )}
        </div>

        {(exerciseItem.videoUrl) ?
        <div
          ref={buttonRef}
        >
          <button
            type="button"
            className="p-0 cursor-pointer"
            aria-label="Show exercise video"
            onClick={() => setShowPreview(true)}
          >
            <VideocamIcon sx={{ fontSize: 24}} />
          </button>
        </div>
        : (!exerciseItem.exerciseId && searchResults.length === 0 && exerciseItem.name.length > 2) ?
        <div
          ref={buttonRef}
        >
          <button
            id="add-new-exercise-button"
            type="button"
            className="p-0 cursor-pointer"
            aria-label="Add new exercise"
            onClick={() => setShowSaveExerciseDialog(true)}
          >
            <VideoCallIcon sx={{ fontSize: 24, color: '#5e748b'}} />
          </button>
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
          className="text-sm border-0 outline-none w-full resize-none my-2"
        />
      </div>
    </div>
  )
};

export default WorkoutFormExercise;


