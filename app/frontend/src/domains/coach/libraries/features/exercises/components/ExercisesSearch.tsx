import SearchBar from "../../../../core/components/SearchBar";
import FormField from "../../../components/FormField";
import { useState, useRef, useMemo, useEffect } from "react";
import { highlightQuery } from "../../../../core/utils/text";
import { useExerciseSearch } from "../hooks/useExerciseSearch";
import { useOutsideClickDismiss } from "../../../../core/hooks/useOutsideClickDismiss";

interface ExercisesSearchProps {
  handleAddExercise: (exerciseId: number) => void;
  exerciseIds: number[];
}

const ExercisesSearch = ({handleAddExercise, exerciseIds}: ExercisesSearchProps) => {
  const [searchString, setSearchString] = useState('');
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { results: searchResults, search } = useExerciseSearch();

  useOutsideClickDismiss([searchContainerRef], () => {
    setSearchString('');
  });

  const addedExerciseIds = useMemo(
    () => new Set(exerciseIds),
    [exerciseIds]
  );

  const filteredSearchResults = useMemo(() => {
    return searchResults.filter((res) => !addedExerciseIds.has(res.id));
  }, [searchResults, addedExerciseIds]);

  // fetch search results
  useEffect(() => {
    if (searchString.length < 4) return;
  
    const delayDebounce = setTimeout(() => {
      search(searchString);
    }, 300); 
  
    return () => clearTimeout(delayDebounce); 
  }, [searchString]);

  return (
    <FormField label="Demo videos" id="demo-videos">
      <div ref={searchContainerRef} className="relative">
        <SearchBar
        searchString={searchString}
        searchHandler={setSearchString}
        placeholder="Add exercise demo videos (optional)"
        className="mt-1"
        />

        {searchString.length >= 4 && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded shadow-md max-h-60 overflow-y-auto z-50">
            {filteredSearchResults.length > 0 ? (
            filteredSearchResults.map((exercise) => (
              <div
                key={exercise.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  if (!exerciseIds.includes(exercise.id)) {
                      handleAddExercise(exercise.id)
                      setSearchString('');
                  }
              }}
              >
                {highlightQuery(exercise.name, searchString)}
                </div>
            ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No matches found.</div>
            )}
        </div>
        )}
      </div>
    </FormField>
  )
};

export default ExercisesSearch;