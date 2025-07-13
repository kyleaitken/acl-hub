import { useNavigate } from "react-router-dom";
import ExerciseForm, { ExerciseFormValues } from "../components/ExerciseForm";
import { useExercisesActions } from "../hooks/useExercisesActions";
import { toast } from 'react-hot-toast';

const AddExercise = () => {
    const navigate = useNavigate();
    const { addExercise } = useExercisesActions();

    const handleAddExercise = async (formData: ExerciseFormValues) => {
        try {
            await addExercise(formData);
            navigate('/coach/library/exercises'); 
        } catch (e) {
            console.error('Failed to add exercise:', e);
            toast.error("Failed to add exercise")
        }
    };

    return (
      <>
        <ExerciseForm
          formTitle="Add Exercise"
          initialValues={{ name: '', videoUrl: '', description: '', category: '', muscleGroup: '' }}
          onSubmit={handleAddExercise}
          isEditing={false}
        />
      </>
    )
};

export default AddExercise;