import SearchBar from "../../../../core/components/SearchBar";
import FormField from "../../../components/FormField";
import { useState, useRef, useMemo, useEffect } from "react";
import { useExerciseSearch } from "../hooks/useExerciseSearch";
import { useOutsideClickDismiss } from "../../../../core/hooks/useOutsideClickDismiss";
import ExerciseSearchResults from "./ExerciseSearchResults";
import { Exercise } from "../types";

interface ExercisesSearchProps {
  handleAddExercise: (exercise: Exercise) => void;
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
        <ExerciseSearchResults 
          searchResults={filteredSearchResults}
          searchString={searchString}
          handleAddExercise={(ex: Exercise) => {
            setSearchString('');
            handleAddExercise(ex);
          }}
        />
        )}
      </div>
    </FormField>
  )
};

export default ExercisesSearch;