import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface ExerciseFormValues {
  name: string;
  videoUrl?: string;
  description?: string;
  category?: string;
  muscleGroup?: string;
}

interface ExerciseFormProps {
  formTitle: string;
  initialValues: ExerciseFormValues;
  onSubmit: (values: ExerciseFormValues) => void;
  submitLabel?: string;
  cancelLabel?: string;
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
}: ExerciseFormProps) => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');

  useEffect(() => {
    setName(initialValues.name || '');
    setUrl(initialValues.videoUrl || '');
    setDescription(initialValues.description || '');
    setCategory(initialValues.category || '');
    setMuscleGroup(initialValues.muscleGroup || '');
  }, [initialValues]);

  const getEmbedUrl = (url: string): string => {
    if (url.includes('/embed/')) return url;

    const videoIdMatch = url.match(/(?:v=|\/shorts\/|\.be\/)([\w-]{11})/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : '';
  };

  const embedUrl = getEmbedUrl(url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, videoUrl: embedUrl, description, category, muscleGroup });
  };

  return (
    <div className="flex flex-col pl-15 py-10 pr-40 mb-30">
      <p className="font-semibold text-2xl">{formTitle}</p>
      <form onSubmit={handleSubmit} className="w-full bg-white rounded-md shadow-xl mt-6 pt-5">
        <FormField label="Exercise Name" id="exercise-name" required>
          <input
            id="exercise-name"
            className="border mt-1 py-2 px-3 rounded-sm"
            placeholder="Enter an exercise name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormField>

        <FormField label="Link to Video" id="video-url">
          <input
            id="video-url"
            className="border mt-1 py-2 px-3 rounded-sm"
            placeholder="Enter video URL (Optional)"
            value={url}
            onChange={(e) => {
                    setUrl(e.target.value);
                }
            }
          />
        </FormField>

        <div className="px-5 pb-5 h-[700px]">
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
            className="border mt-1 py-2 px-3 rounded-sm"
            placeholder="Enter a description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormField>

        <div className="flex flex-wrap">
          <FormField label="Primary Muscles" id="muscle-group">
            <select
              id="muscle-group"
              className="border mt-1 py-2 px-3 rounded-sm w-[400px]"
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
              className="border mt-1 py-2 px-3 rounded-sm w-[400px]"
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
            className={`h-[45px] w-[170px] rounded-md px-3 py-2 text-white flex items-center justify-center mr-5
              ${name.trim() ? 'bg-[#4e4eff] cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {submitLabel}
          </button>
          <button
            type="button"
            className="h-[45px] w-[170px] rounded-md bg-red-500 px-3 py-2 text-white cursor-pointer flex items-center justify-center mr-5"
            onClick={() => navigate("/coach/library/exercises")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExerciseForm;

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
