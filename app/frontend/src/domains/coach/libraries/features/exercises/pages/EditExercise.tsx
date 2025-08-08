import { useParams } from "react-router-dom";
import { useExercisesData } from "../hooks/useExercisesData";
import { useEffect } from "react";
import { useExercisesActions } from "../hooks/useExercisesActions";
import ExerciseForm, { ExerciseFormValues } from "../components/ExerciseForm";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

const EditExercise = () => {
    const { fetchExercise, updateExercise } = useExercisesActions();
    const { exerciseId } = useParams();
    const id = Number(exerciseId);
    const navigate = useNavigate();    
    const { exercises } = useExercisesData();
    const exercise = exercises.find((e) => e.id === id);

    // fallback if exercise not found in store
    useEffect(() => {
        if (id && !exercise) {
          fetchExercise(id);
        }
    }, [id, exercise]);

    const handleUpdateExercise = async (formData: ExerciseFormValues) => {
        try {
            await updateExercise({exerciseId: id, ...formData});
            navigate('/coach/library/exercises'); 
        } catch (e) {
            console.error('Failed to update exercise:', e);
            toast.error("Failed to udpate exercise")
        }
    }

    if (!exercise) {
        return <p className="pl-15 py-10 pr-40">Loading exercise...</p>;
    }

    return (
        <ExerciseForm
            formTitle={`Edit ${exercise.name}`}
            initialValues={{
                id: exerciseId,
                name: exercise.name,
                videoUrl: exercise.video_url,
                description: exercise.description,
                category: exercise.category,
                muscleGroup: exercise.muscle_group,
            }}
            onSubmit={handleUpdateExercise}
            isEditing={true}
        />
    )
};

export default EditExercise;