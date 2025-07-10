import AddIcon from '@mui/icons-material/Add';
import SearchBar from '../../../shared/components/SearchBar';
import { useEffect, useMemo, useState } from 'react';
import { useExercisesData } from '../hooks/useExercisesData';
import { Exercise } from '../../core/types/models';
import { useExercisesActions } from '../hooks/useExercisesActions';
import { useNavigate } from 'react-router-dom';

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

    const highlightQuery = (text: string | undefined, query: string) => {
        if (!query || !text) return text;
        const lowerExerciseName = text.toLowerCase();
        const lowerQuery =  query.toLowerCase();
        const index = lowerExerciseName.indexOf(lowerQuery);

        if (index === -1) return text;
        
        return (
            <>
                {text.slice(0, index)}
                <span className='bg-teal-200'>{text.slice(index, index + lowerQuery.length)}</span>
                {text.slice(index + lowerQuery.length)}
            </>
        )
    }

    return (
        <div className='flex flex-col pl-15 py-10 pr-40'>
            <div className="exercises-header flex justify-between">
                <p className="font-semibold text-2xl">Exercises</p>
                <button               
                    className="h-[45px] w-[170px] rounded-md bg-[#4e4eff] px-3 py-2 text-white cursor-pointer flex items-center justify-center"
                    onClick={() => navigate('/coach/library/exercises/add')}
                >
                    <AddIcon sx={{mr: 1}}/>
                    Add Exercise
                </button>
            </div>
            <p className='text-sm'>Use the exercises library to add demo videos for your clients</p>
            <SearchBar 
                searchString={searchString} 
                searchHandler={setSearchString}
                placeholder='Search exercises by name'
                className='mt-10'
            />
            <div className="mt-6">
                <div className="grid grid-cols-3 gap-4 border rounded-t-md bg-[#eaeafe] px-2 py-4 font-semibold text-sm text-gray-700">
                    <p>Exercise Name</p>
                    <p>Category</p>
                    <p>Primary Muscle Group</p>
                </div>
                {(exercisesToDisplay ?? exercises).map((exercise) => (
                    <div
                        key={exercise.id}
                        className="grid grid-cols-3 gap-4 py-3 px-2 border border-t-0 text-sm bg-white cursor-pointer hover:bg-gray-100"
                        onClick={() => navigate(`/coach/library/exercises/${exercise.id}/edit`)}
                    >
                        <p className='font-semibold'>
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