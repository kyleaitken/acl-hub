import { Paper } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { ClientProgramWorkoutExercise } from '../types';

interface ExerciseCardProps {
  exercise: ClientProgramWorkoutExercise;
}

const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
  const getResultsSectionText = (completed: boolean, results?: string) =>
    results ? results : completed ? 'Completed' : 'Not Completed';

  const statusColor = exercise.completed === true ? 'green' : 'red';

  return (
    <div className="exercise-container flex flex-col">
      <div className="exercise-header-box mb-5 flex items-center">
        <div className="exercise-order text-sm flex h-6 w-6 items-center justify-center rounded-md bg-[var(--button-highlight)]">
          <p>{exercise.order}</p>
        </div>
        <p className="ml-3 flex-grow text-md font-semibold">{exercise.name}</p>
        {exercise.completed ? (
          <CheckIcon sx={{ color: 'green' }} />
        ) : (
          <CloseIcon sx={{ color: 'red' }} />
        )}
      </div>
      <div className="exercise-content-box ml-9 flex flex-col">
        <p className="exercise-instructions mb-3 text-sm whitespace-pre-line">
          {exercise.instructions || '3 Sets x 10 Reps\nSlow and controlled'}
        </p>
        <Paper
          sx={{
            backgroundColor:
              exercise.completed === true ? '#E5FFF6' : '#ffdde6',
            borderLeft: `4px solid ${statusColor}`,
            borderRadius: '2px',
            marginBottom: '30px',
            padding: '12px 15px',
          }}
        >
          <p className="whitespace-pre-line text-sm">
            {getResultsSectionText(exercise.completed, exercise.results)}
          </p>
        </Paper>
      </div>
    </div>
  );
};

export default ExerciseCard;
