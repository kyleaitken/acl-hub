import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../../../core/components/ConfirmModal';
import toast from 'react-hot-toast';
import { useWarmupsActions } from '../hooks/useWarmupsActions';
import { useExercisesData } from '../../exercises/hooks/useExercisesData';
import { useExercisesActions } from '../../exercises/hooks/useExercisesActions';
import FormField from '../../../components/FormField';
import ExercisesSearch from '../../exercises/components/ExercisesSearch';
import ExerciseTagsContainer from '../../exercises/components/ExerciseTagsContainer';
import { useCooldownsActions } from '../hooks/useCooldownsActions';

// TODO: Could refactor this to make use of detailed route from backend 
// so that we don't store the exerciseIds, but rather the full exercises like the WorkoutForm does.
// Wouldn't need to fetch the exercises that way.

export interface WarmupCooldownFormValues {
  name: string;
  instructions?: string;
  exerciseIds?: number[];
  id?: number;
  custom?: boolean;
}

interface WarmupCooldownFormProps {
  formTitle: string;
  formType: 'Warmup' | 'Cooldown';
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
  formType,
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
  const { deleteCooldown } = useCooldownsActions();

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

  const handleDeleteClicked = async () => {
    if (!initialValues.id) return;
    setShowConfirmDelete(false);

    const deleteHandler = formType === "Cooldown" ? deleteCooldown : deleteWarmup;
    try {
      await deleteHandler(Number(initialValues.id));
      navigate(`/coach/library/${formType.toLowerCase()}s`);
      toast.success(`${formType} deleted!`);
    } catch (e) {
      console.error(`Failed to delete ${formType}:`, e);
      toast.error(`Failed to delete ${formType}.`)
    }
  }

  return (
    <div className="flex flex-col pl-15 py-10 pr-40 mb-30">
      <p className="font-semibold text-2xl">{formTitle}</p>
      <form onSubmit={handleSubmit} className="w-full bg-white rounded-md shadow-xl mt-6 pt-5">
        <FormField label={`${formType} Name`} id={`${formType}-name`} required>
          <input
            id={`${formType}-name`} 
            className="border mt-1 py-2 px-3 rounded-sm"
            placeholder={`Enter a ${formType.toLowerCase()} name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormField>

        <FormField label="Instructions" id="instructions">
          <textarea
            id="instructions"
            className="border mt-1 py-2 px-3 rounded-sm"
            placeholder="Enter some instructions (Optional)"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </FormField>

        <ExercisesSearch 
          handleAddExercise={(ex) => setExerciseIds(prev => [...prev, ex.id])}
          exerciseIds={exerciseIds}
        />

        <ExerciseTagsContainer 
          addedExercises={addedExercises}
          onRemoveExercise={(ex) => setExerciseIds(exerciseIds.filter((id) => id !== ex.id))}
        />

        <div className="flex px-5 pb-6 pt-2">
          <button
            type="submit"
            disabled={!name.trim()}
            className={`h-[45px] w-[170px] rounded-md px-3 py-2 text-white flex items-center justify-center mr-5
              ${name.trim() ? 'bg-[var(--blue-button)] cursor-pointer hover:bg-blue-800' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {submitLabel}
          </button>
          <button
            type="button"
            className="h-[45px] w-[170px] rounded-md bg-white px-3 py-2 text-blue-500 border-1 border-blue-500 cursor-pointer flex items-center justify-center mr-5 hover:bg-gray-100"
            onClick={() => navigate(`/coach/library/${formType.toLowerCase()}s`)}
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
          title={`Are you sure you want to delete this ${formType}`}
          confirmButtonText="Delete"
          confirmHandler={handleDeleteClicked}
          cancelHandler={() => setShowConfirmDelete(false)}
          isDanger={true}
        />
      )}

    </div>
  );
};

export default WarmupCooldownForm;

