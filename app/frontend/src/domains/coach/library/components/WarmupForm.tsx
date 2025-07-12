import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import toast from 'react-hot-toast';
import { useWarmupsActions } from '../hooks/useWarmupsActions';
import { Exercise } from '../../core/types/models';
import SearchBar from '../../../shared/components/SearchBar';
import { useExercisesData } from '../hooks/useExercisesData';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VideocamIcon from '@mui/icons-material/Videocam';
import { useExercisesActions } from '../hooks/useExercisesActions';
import { highlightQuery } from '../../core/utils/text';
import { useExerciseSearch } from '../hooks/useExerciseSearch';

export interface WarmupFormValues {
  name: string;
  instructions?: string;
  exerciseIds?: number[];
  id?: number;
}

interface WarmupFormProps {
  formTitle: string;
  initialValues: {
    name?: string;
    instructions?: string;
    exerciseIds?: number[];
    id?: number;
  };
  onSubmit: (values: WarmupFormValues) => void;
  submitLabel?: string;
  isEditing: boolean;
}

const WarmupForm = ({
  formTitle,
  initialValues,
  onSubmit,
  submitLabel = 'Save Warmup',
  isEditing,
}: WarmupFormProps) => {
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [exerciseIds, setExerciseIds] = useState<number[]>([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [searchString, setSearchString] = useState('');

  const { exercisesMap } = useExercisesData();
  const { fetchExercise } = useExercisesActions();
  const navigate = useNavigate();
  const { deleteWarmup } = useWarmupsActions();
  const { results: searchResults, search, loading } = useExerciseSearch();

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const addedExerciseIds = useMemo(
    () => new Set(exerciseIds),
    [exerciseIds]
  );
  
  const filteredSearchResults = useMemo(() => {
    return searchResults.filter((res) => !addedExerciseIds.has(res.id));
  }, [searchResults, addedExerciseIds]);

  const addedExercises = useMemo(() => {
    return (exerciseIds ?? [])
      .map((id) => exercisesMap[id])
      .filter(Boolean);
  }, [exerciseIds, exercisesMap]);

  // fetch search results
  useEffect(() => {
    if (searchString.length < 4) return;
  
    const delayDebounce = setTimeout(() => {
      search(searchString);
    }, 300); 
  
    return () => clearTimeout(delayDebounce); 
  }, [searchString]);

  // fetch missing exercises if needed
  useEffect(() => {
    const missingIds = (exerciseIds ?? []).filter((id) => !exercisesMap[id]);
    if (missingIds.length > 0) {
      missingIds.forEach((id) => fetchExercise(id));
    }
  }, [exerciseIds, exercisesMap]);

  // set initial values
  useEffect(() => {
    setName(initialValues.name || '');
    setInstructions(initialValues.instructions || '');
    setExerciseIds(initialValues.exerciseIds || []);
  }, [initialValues]);

  // dismiss dropdown when search loses focus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchString('');
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getEmbedUrl = (url: string): string => {
    if (url.includes('/embed/')) return url;

    const videoIdMatch = url.match(/(?:v=|\/shorts\/|\.be\/)([\w-]{11})/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, instructions, exerciseIds });
  };

  const handleDeleteWarmup = () => {
    if (!initialValues.id) return;
    setShowConfirmDelete(false);

    try {
      deleteWarmup(Number(initialValues.id));
      navigate("/coach/library/warmups");
      toast.success("Warmup deleted!");
    } catch (e) {
      console.error("Failed to delete warmup:", e);
      toast.error("Failed to delete warmup")
    }
  }

  return (
    <div className="flex flex-col pl-15 py-10 pr-40 mb-30">
      <p className="font-semibold text-2xl">{formTitle}</p>
      <form onSubmit={handleSubmit} className="w-full bg-white rounded-md shadow-xl mt-6 pt-5">
        <FormField label="Warmup Name" id="warmup-name" required>
          <input
            id="warmup-name"
            className="border mt-1 py-2 px-3 rounded-sm"
            placeholder="Enter an warmup name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormField>

        {/* <div className="px-5 pb-5 h-[700px]">
          {embedUrl ? (
            <iframe
              title="Video Preview"
              src={embedUrl}
              className="w-full h-full rounded-md border transition-all duration-300 ease-in"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full rounded-md border bg-gray-100 flex items-center justify-center text-sm text-gray-500">
              No video preview available
            </div>
          )}
        </div> */}

        <FormField label="Instructions" id="warmup-instruction">
          <textarea
            id="warmup-instruction"
            className="border mt-1 py-2 px-3 rounded-sm"
            placeholder="Enter some instructions (Optional)"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </FormField>

        <FormField label="Demo videos" id="demo-videos">
            <div ref={searchContainerRef} className="relative">
                <SearchBar
                searchString={searchString}
                searchHandler={setSearchString}
                placeholder="Add exercise demo videos (optional)"
                className="mt-1"
                />

                {/* Always render dropdown container when input is focused and query is long enough */}
                {searchString.length >= 4 && (
                <div className="absolute top-full left-0 right-0 bg-white border rounded shadow-md max-h-60 overflow-y-auto z-50">
                    {filteredSearchResults.length > 0 ? (
                    filteredSearchResults.map((exercise) => (
                        <div
                        key={exercise.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => {
                            if (!exerciseIds.includes(exercise.id)) {
                                setExerciseIds(prev => [...prev, exercise.id]);
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



        <div id="warmup-exercise-tags-wrapper" className='flex flex-wrap max-w-full px-4 pb-4'>
            {addedExercises.map((exercise: Exercise) => {
                return (
                    <div key={exercise.id} className='flex items-center justify-center bg-gray-100 rounded-xl mr-2 mt-2'>
                        <IconButton sx={{py: 0.5, px: 1,
                            '&:hover': {
                                backgroundColor: '#d1d5db'
                            }
                        }}>
                            <VideocamIcon sx={{fontSize: '16px', p: 0}}/>
                        </IconButton>
                        <span className='text-xs font-semibold'>{exercise.name}</span>
                        <IconButton 
                            onClick={() => setExerciseIds(exerciseIds.filter((ex) => ex !== exercise.id))}
                            sx={{
                            py: 0.5, px: 1,
                            '&:hover': {
                                backgroundColor: '#d1d5db' 
                            }
                            }}
                        >
                            <CloseIcon sx={{fontSize: '16px'}} />
                        </IconButton>
                    </div>
                )
            })}
        </div>

        <div className="flex px-5 pb-6 pt-2">
          <button
            type="submit"
            disabled={!name.trim()}
            className={`h-[45px] w-[170px] rounded-md px-3 py-2 text-white flex items-center justify-center mr-5
              ${name.trim() ? 'bg-[#4e4eff] cursor-pointer hover:bg-blue-800' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {submitLabel}
          </button>
          <button
            type="button"
            className="h-[45px] w-[170px] rounded-md bg-white px-3 py-2 text-blue-500 border-1 border-blue-500 cursor-pointer flex items-center justify-center mr-5 hover:bg-gray-100"
            onClick={() => navigate("/coach/library/warmups")}
          >
            Cancel
          </button>
          {isEditing && (
            <div className='ml-auto'>
              <button
                type="button"
                className="self-end h-[45px] w-[170px] rounded-md bg-red-500 px-3 py-2 text-white cursor-pointer flex items-center justify-center mr-5 hover:bg-red-700"
                onClick={() => setShowConfirmDelete(true)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </form>
      {showConfirmDelete && (
        <ConfirmModal
          title="Are you sure you want to delete this warmup?"
          confirmButtonText="Delete"
          confirmHandler={handleDeleteWarmup}
          cancelHandler={() => setShowConfirmDelete(false)}
          isDanger={true}
        />
      )}
    </div>
  );
};

export default WarmupForm;

const FormField = ({
  label,
  id,
  required = false,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col px-5 pb-5">
    <label htmlFor={id} className="text-sm font-semibold">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);
