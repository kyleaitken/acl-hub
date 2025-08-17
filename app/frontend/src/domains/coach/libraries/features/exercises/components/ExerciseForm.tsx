import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExercisesActions } from '../hooks/useExercisesActions';
import ConfirmModal from '../../../../core/components/ConfirmModal';
import toast from 'react-hot-toast';
import FormField from '../../../components/FormField';
import { getEmbedUrl } from '../../../../core/utils/text';

export interface ExerciseFormValues {
  name: string;
  videoUrl?: string;
  description?: string;
  category?: string;
  muscleGroup?: string;
  id?: string,
}

interface ExerciseFormProps {
  formTitle: string;
  initialValues: ExerciseFormValues;
  onSubmit: (values: ExerciseFormValues) => void;
  submitLabel?: string;
  isEditing: boolean;
}

const CATEGORY_OPTIONS = [
  { label: 'Upper Body', options: ['Vertical Upper Push', 'Vertical Upper Pull', 'Horizontal Upper Push', 'Horizontal Upper Pull', 'Upper Accessory'] },
  { label: 'Lower Body', options: ['Lower Push', 'Lower Pull', 'Hinge', 'Lower Accessory'] },
  { label: 'Core', options: ['Anti-Extension', 'Anti-Flexion', 'Anti-Rotation', 'Anti-Lateral-Flexion', 'Flexion', 'Extension', 'Rotation', 'Lateral-Flexion'] },
  { label: 'Other', options: ['Power', 'Plyometric'] },
];

const MUSCLE_GROUP_OPTIONS = ['Chest', 'Biceps', 'Triceps', 'Shoulders', 'Back', 'Quads', 'Hamstrings', 'Glutes', 'Traps', 'Forearms', 'Calves', 'Core'];

const ExerciseForm = ({
  formTitle,
  initialValues,
  onSubmit,
  submitLabel = 'Save Exercise',
  isEditing,
}: ExerciseFormProps) => {
  const navigate = useNavigate();
  const { deleteExercise } = useExercisesActions();

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    setName(initialValues.name || '');
    setUrl(initialValues.videoUrl || '');
    setDescription(initialValues.description || '');
    setCategory(initialValues.category || '');
    setMuscleGroup(initialValues.muscleGroup || '');
  }, [initialValues]);

  const embedUrl = getEmbedUrl(url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, videoUrl: embedUrl, description, category, muscleGroup });
  };

  const handleDeleteExercise = async () => {
    if (!initialValues.id) return;
    
    try {
      await deleteExercise(Number(initialValues.id));
      navigate("/coach/library/exercises");
      toast.success("Exercise deleted!");
    } catch (e) {
      console.error("Failed to delete exercise:", e);
      toast.error("Failed to delete exercise")
    } finally {
      setShowConfirmDelete(false);
    }
  }

  return (
    <div className="flex flex-col pl-25 py-10 pr-80 mb-30">
      <p className="font-semibold text-xl">{formTitle}</p>
      <form onSubmit={handleSubmit} className="w-full bg-white rounded-md shadow-xl mt-6 pt-5">
        <FormField label="Exercise Name" id="exercise-name" required>
          <input
            id="exercise-name"
            className="border mt-1 py-2 px-3 rounded-sm text-sm"
            placeholder="Enter an exercise name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormField>

        <FormField label="Link to Video" id="video-url">
          <input
            id="video-url"
            className="border mt-1 py-2 px-3 rounded-sm text-sm"
            placeholder="Enter video URL (Optional)"
            value={url}
            onChange={(e) => {
                    setUrl(e.target.value);
                }
            }
          />
        </FormField>

        <div className="px-5 pb-5 h-[600px]">
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
        </div>

        <FormField label="Description" id="exercise-description">
          <textarea
            id="exercise-description"
            className="border mt-1 py-2 px-3 rounded-sm text-sm"
            placeholder="Enter a description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormField>

        <div className="flex flex-wrap">
          <FormField label="Primary Muscles" id="muscle-group">
            <select
              id="muscle-group"
              className="border mt-1 py-2 px-3 rounded-sm w-[400px] text-sm"
              value={muscleGroup}
              onChange={(e) => setMuscleGroup(e.target.value)}
            >
              <option value="" disabled>Select a muscle group</option>
              {MUSCLE_GROUP_OPTIONS.map((muscle) => (
                <option key={muscle} value={muscle}>
                  {muscle}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Category" id="category">
            <select
              id="category"
              className="border mt-1 py-2 px-3 rounded-sm w-[400px] text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>Select an exercise category</option>
              {CATEGORY_OPTIONS.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </FormField>
        </div>

        <div className="flex px-5 pb-6 pt-2">
          <button
            type="submit"
            disabled={!name.trim()}
            className={`text-sm h-[40px] w-[170px] rounded-md px-3 py-2 text-white flex items-center justify-center mr-5
              ${name.trim() ? 'bg-[var(--blue-button)] cursor-pointer hover:bg-blue-800' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {submitLabel}
          </button>
          <button
            type="button"
            className="text-sm h-[40px] w-[170px] rounded-md bg-white px-3 py-2 text-blue-500 border-1 border-blue-500 cursor-pointer flex items-center justify-center mr-5 hover:bg-gray-100"
            onClick={() => navigate("/coach/library/exercises")}
          >
            Cancel
          </button>
          {isEditing && (
            <div className='ml-auto'>
              <button
                type="button"
                className="text-sm self-end h-[40px] w-[170px] rounded-md bg-red-500 px-3 py-2 text-white cursor-pointer flex items-center justify-center mr-0 hover:bg-red-700"
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
          title="Are you sure you want to delete this exercise?"
          confirmButtonText="Delete"
          confirmHandler={handleDeleteExercise}
          cancelHandler={() => setShowConfirmDelete(false)}
          isDanger={true}
        />
      )}
    </div>
  );
};

export default ExerciseForm;
