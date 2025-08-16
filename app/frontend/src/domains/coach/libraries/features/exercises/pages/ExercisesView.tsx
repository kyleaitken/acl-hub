import SearchBar from '../../../../core/components/SearchBar';
import { useEffect, useMemo, useState } from 'react';
import { useExercisesData } from '../hooks/useExercisesData';
import { Exercise } from '../types';
import { useExercisesActions } from '../hooks/useExercisesActions';
import { useNavigate } from 'react-router-dom';
import LibraryHeader from '../../../components/LibraryHeader';
import { highlightQuery } from '../../../../core/utils/text';

const ExercisesView = () => {
    const [searchString, setSearchString] = useState('');
    const { exercises, loading, hasMore, page } = useExercisesData();
    const [filteredExercises, setFilteredExercises] = useState<Exercise[] | null>(null);

    const { fetchExercises } = useExercisesActions();
    const navigate = useNavigate();

    useEffect(() => {
        fetchExercises();
    }, [])

    const sortedExercises = useMemo(() => {
        return exercises
            .slice()
            .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }, [exercises]);

    useEffect(() => {
        if (searchString.trim() === '') {
            setFilteredExercises(null);
        } else {
            const lowerCaseSearch = searchString.toLowerCase();
            const filtered = sortedExercises.filter((exercise) => {
                const nameIncludes = exercise.name?.toLowerCase().includes(lowerCaseSearch);
                const categoryIncludes = exercise.category?.toLowerCase().includes(lowerCaseSearch);
                const musclesIncludes = exercise.muscle_group?.toLowerCase().includes(lowerCaseSearch);
                return nameIncludes || categoryIncludes || musclesIncludes
            });
            setFilteredExercises(filtered);
        }
    }, [searchString]);

    const exercisesToDisplay = filteredExercises ?? sortedExercises;

    useEffect(() => {
        const onScroll = () => {
          if (
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
            !loading &&
            hasMore
          ) {
            fetchExercises(page + 1);
          }
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [loading, hasMore, page]);

    return (
        <div className='flex flex-col pl-25 py-10 pr-80'>
            <LibraryHeader 
                title={"Exercises"}
                subtitle={"Use the exercises library to add demo videos for your clients"}
                buttonText={"Add Exercise"}
                addHandler={() => navigate('/coach/library/exercises/add')}
            />
            <SearchBar 
                searchString={searchString} 
                searchHandler={setSearchString}
                placeholder='Search exercises by name'
                className='mt-10'
            />
            <div className="mt-6">
                <div className="grid grid-cols-3 gap-4 border rounded-t-md bg-[#eaeafe] px-2 py-3 font-semibold text-[14px] text-gray-700">
                    <p>Exercise Name</p>
                    <p>Category</p>
                    <p>Primary Muscle Group</p>
                </div>
                {exercisesToDisplay.map((exercise) => (
                    <div
                        key={exercise.id}
                        className="grid grid-cols-3 gap-4 py-3 px-2 border border-t-0 text-[12px] bg-white cursor-pointer hover:bg-gray-100"
                        onClick={() => navigate(`/coach/library/exercises/${exercise.id}/edit`)}
                    >
                        <p className='font-semibold truncate pr-3'>
                            {highlightQuery(exercise.name, searchString)}
                        </p>
                        <p>{highlightQuery(exercise.category, searchString)}</p>
                        <p>{highlightQuery(exercise.muscle_group, searchString)}</p>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default ExercisesView;