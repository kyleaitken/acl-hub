import { TextareaAutosize } from "@mui/material";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useEffect, useRef, useState } from "react";
import { useOutsideClickDismiss } from "../../core/hooks/useOutsideClickDismiss";
import ExerciseSearchResults from "../../libraries/features/exercises/components/ExerciseSearchResults";
import { useExerciseSearch } from "../../libraries/features/exercises/hooks/useExerciseSearch";
import ExerciseTagsContainer from "../../libraries/features/exercises/components/ExerciseTagsContainer";
import { LibraryRoutine } from "../../libraries/features/routines/types";
import { highlightQuery } from "../../core/utils/text";
import TooltipIconButton from "../../core/components/TooltipIconButton";
import { useDisableScroll } from "../../core/hooks/useDisableScroll";
import AddNewRoutineDialog from "./AddNewRoutineDialog";
import { Exercise } from "../../libraries/features/exercises/types";

interface WorkoutFormWarmupOrCooldownProps {
  type: "warmup" | "cooldown";
  routineSegmentSearchResults: LibraryRoutine[];
  instructions: string;
  exercises: Exercise[];
  onChange: (type: "warmup" | "cooldown", value: string) => void;
  addRoutineFromLibrary: (type: "warmup" | "cooldown", routine: LibraryRoutine) => void;
  removeExerciseFromRoutine: (type: "warmup" | "cooldown", exercise: Exercise) => void;
  addExerciseToRoutine: (type: "warmup" | "cooldown", exercise: Exercise) => void;
  saveRoutineToLibrary: (type: "warmup" | "cooldown", name: string, instructions: string, exerciseIds: number[]) => void;
}

const WorkoutFormWarmupOrCooldown = ({type, 
  routineSegmentSearchResults, 
  instructions = '', 
  exercises,
  onChange, 
  addRoutineFromLibrary,
  removeExerciseFromRoutine,
  addExerciseToRoutine,
  saveRoutineToLibrary
}: WorkoutFormWarmupOrCooldownProps) => {
  const [exerciseSearchString, setExerciseSearchString] = useState('');
  const [isSearchingRoutines, setIsSearchingRoutines] = useState(false);
  const [isSearchingExercises, setIsSearchingExercises] = useState(false);
  const [showSaveNewRoutine, setShowSaveNewRoutine] = useState(false);
  const [showSaveRoutineDialog, setShowSaveRoutineeDialog] = useState(false);

  const exerciseContainerRef = useRef<HTMLDivElement>(null);
  const instructionsContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const { results: searchResults, search } = useExerciseSearch();

  const scrollEl = typeof window !== "undefined" ? document.getElementById("program-scroll") : null;
  useDisableScroll(showSaveRoutineDialog, scrollEl);
  
  useOutsideClickDismiss(
    [exerciseContainerRef, instructionsContainerRef],
    () => {
      handleEscapeCloseExercisesSearch();
      setIsSearchingRoutines(false);
    }
  );

  useEffect(() => {
    if (exerciseSearchString.length < 3) {
      return;
    }

    const h = setTimeout(() => {
      search(exerciseSearchString);
    }, 250);

    return () => clearTimeout(h);
  }, [exerciseSearchString]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchingRoutines(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const handleEscapeCloseExercisesSearch = () => {
    setIsSearchingExercises(false);
    setExerciseSearchString('');
  };  

  const exerciseIdSet = new Set(exercises.map((item) => item.id));
  const filteredExercises = searchResults.filter((res) => !exerciseIdSet.has(res.id));

  const showRoutineSearchResults = isSearchingRoutines && instructions.length > 2 && routineSegmentSearchResults.length > 0;
  const showExerciseSearchResults = isSearchingExercises && exerciseSearchString.length > 2 && searchResults.length > 0;
  const anchorRect = buttonRef.current ? buttonRef.current.getBoundingClientRect() : null;

  return (
    <div id={`workout-form-${type}`} className={`px-3 ${type === "cooldown" ? "mt-4": ""}`}>
      <div className="flex items-start relative" ref={instructionsContainerRef}>
        <TextareaAutosize
          minRows={2}
          maxRows={3}
          placeholder={`Add ${type}`}
          value={instructions}
          onChange={(e) => {
            setIsSearchingRoutines(true);
            setShowSaveNewRoutine(true);
            onChange(type, e.target.value);
          }}
          className="text-[11px] border-0 outline-none w-full resize-none"
        />

        {showSaveNewRoutine && instructions.length > 1 &&
        <div ref={buttonRef}>
          <TooltipIconButton
            tooltipContent={`Save ${type}`}
            onClick={() => setShowSaveRoutineeDialog(true)}
            aria-label={`Save ${type}`}
            buttonClassName={"cursor-pointer"}
            tooltipPosition="top"
          >
            <BookmarkIcon sx={{fontSize: 18, color: '#5e748b'}}/>
          </TooltipIconButton>  
        </div>
        }

        {showSaveRoutineDialog && anchorRect &&
        <AddNewRoutineDialog 
          anchorRect={anchorRect}
          handleDismiss={() => setShowSaveRoutineeDialog(false)}
          handleSave={(name: string) => {
            saveRoutineToLibrary(type, name.trim(), instructions, Array.from(exerciseIdSet));
            setShowSaveNewRoutine(false);
          }}
        />
        }

        {showRoutineSearchResults &&
          <div className="absolute top-full -translate-y-10 left-0 right-0 flex flex-col z-50 pointer-events-none">
            <div className="flex justify-center self-end bg-black text-white text-xs px-2 py-1 rounded-md w-[100px] pointer-events-none">
              esc to close
            </div>
                  
            <div className="shadow-md max-h-60 border rounded overflow-y-auto bg-white pointer-events-auto">
              {routineSegmentSearchResults.map((routine, idx) => {
                const itemBottomBorder = idx === routineSegmentSearchResults.length - 1 ? "0" : "1";
                return (
                  <div
                    key={routine.id}
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex flex-col border-b-${itemBottomBorder} border-gray-400`}
                    onClick={() => {
                      setIsSearchingRoutines(false);
                      setShowSaveNewRoutine(false);
                      addRoutineFromLibrary(type, routine)
                    }}
                  >
                    <div className="font-bold">{highlightQuery(routine.name, instructions)}</div>
                    <div>{routine.instructions}</div>
                  </div>
                )
              })}
            </div>
          </div>
        }
      </div>

      {instructions &&
        <div>
          <div ref={exerciseContainerRef} className="relative mb-2">
            <div className="divider my-2 w-full border-t border-gray-500" />
            <input
              placeholder="Link demo video"
              className="text-[11px] outline-none w-full pr-6"
              value={exerciseSearchString}
              onChange={e => {
                setIsSearchingExercises(true);
                setExerciseSearchString(e.target.value)
              }}
            />
            {showExerciseSearchResults && (
              <ExerciseSearchResults
                searchResults={filteredExercises}
                searchString={exerciseSearchString}
                handleAddExercise={(ex) => {
                  addExerciseToRoutine(type, ex);
                  setExerciseSearchString('');
                }}
                onEscape={handleEscapeCloseExercisesSearch}
              />
            )}
          </div>
          <ExerciseTagsContainer
            addedExercises={exercises}
            onRemoveExercise={(ex) => removeExerciseFromRoutine(type, ex)}
            size="small"
          />
        </div>
      }
    </div>
  )
};

export default WorkoutFormWarmupOrCooldown;
