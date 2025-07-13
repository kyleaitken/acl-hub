import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import toast from 'react-hot-toast';
import { useWarmupsActions } from '../hooks/useWarmupsActions';
import { useExercisesData } from '../hooks/useExercisesData';
import { useExercisesActions } from '../hooks/useExercisesActions';
import FormField from '../../core/components/FormField';
import ExercisesSearch from './ExercisesSearch';
import ExerciseTagsContainer from './ExerciseTagsContainer';

export interface WarmupCooldownFormValues {
  name: string;
  instructions?: string;
  exerciseIds?: number[];
  id?: number;
}

interface WarmupCooldownFormProps {
  formTitle: string;
  initialValues: {
    name?: string;
    instructions?: string;
    exerciseIds?: number[];
    id?: number;
  };
  onSubmit: (values: WarmupCooldownFormValues) => void;
  submitLabel: string;
  isEditing: boolean;
}

const WarmupCooldownForm = ({
  formTitle,
  initialValues,
  onSubmit,
  submitLabel,
  isEditing,
}: WarmupCooldownFormProps) => {
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [exerciseIds, setExerciseIds] = useState<number[]>([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const { exercisesMap } = useExercisesData();
  const { fetchExercise } = useExercisesActions();
  const navigate = useNavigate();
  const { deleteWarmup } = useWarmupsActions();

  const addedExercises = useMemo(() => {
    return (exerciseIds ?? [])
      .map((id) => exercisesMap[id])
      .filter(Boolean);
  }, [exerciseIds, exercisesMap]);

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

        <FormField label="Instructions" id="warmup-instruction">
          <textarea
            id="warmup-instruction"
            className="border mt-1 py-2 px-3 rounded-sm"
            placeholder="Enter some instructions (Optional)"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </FormField>

        <ExercisesSearch 
          handleAddExercise={(exerciseId) => setExerciseIds(prev => [...prev, exerciseId])}
          exerciseIds={exerciseIds}
        />

        <ExerciseTagsContainer 
          addedExercises={addedExercises}
          handleRemoveExercise={(id) => setExerciseIds(exerciseIds.filter((ex) => ex !== id))}
        />

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

export default WarmupCooldownForm;

