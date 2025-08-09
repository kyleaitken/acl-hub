import { highlightQuery } from "../../../../core/utils/text";
import { Exercise } from "../types";

interface ExerciseSearchResultsProps {
  searchResults: Exercise[];
  searchString: string;
  handleAddExercise: (exercise: Exercise) => void;
}

const ExerciseSearchResults = ({searchResults, searchString, handleAddExercise}: ExerciseSearchResultsProps) => {
  return (
    <div className="absolute mt-2 top-full left-0 right-0 bg-white border rounded shadow-md max-h-60 overflow-y-auto z-50">
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
  )
};

export default ExerciseSearchResults;