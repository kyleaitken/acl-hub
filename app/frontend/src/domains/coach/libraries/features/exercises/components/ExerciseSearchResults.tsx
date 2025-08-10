import { useEffect } from "react";
import { highlightQuery } from "../../../../core/utils/text";
import { Exercise } from "../types";

interface ExerciseSearchResultsProps {
  searchResults: Exercise[];
  searchString: string;
  handleAddExercise: (exercise: Exercise) => void;
  onEscape: () => void;
}

const ExerciseSearchResults = ({searchResults, searchString, handleAddExercise, onEscape}: ExerciseSearchResultsProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="absolute top-full -translate-y-5 left-0 right-0 flex flex-col z-50 pointer-events-none">
      <div className="flex justify-center self-end bg-black text-white text-xs px-2 py-1 rounded-md w-[100px] pointer-events-none">
        esc to close
      </div>
      <div className="shadow-md max-h-60 border rounded overflow-y-auto bg-white pointer-events-auto" >
        {searchResults.length > 0 ? (
          searchResults.map((exercise) => (
            <div
              key={exercise.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                handleAddExercise(exercise)
              }}
            >
              {highlightQuery(exercise.name, searchString)}
            </div>
          ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">No matches found.</div>
        )}
      </div>
    </div>
  )
};

export default ExerciseSearchResults;