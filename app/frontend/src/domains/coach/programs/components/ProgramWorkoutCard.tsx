import { ProgramWorkout } from "../types";

interface ProgramWorkoutCardProps {
  workout: ProgramWorkout;
};

const ProgramWorkoutCard = ({workout}: ProgramWorkoutCardProps) => {
  return (
    <div
      className="border border-gray-300 rounded-md shadow-sm p-3 mb-2 cursor-move bg-white hover:shadow-md"
    >
      <div className="text-sm font-semibold">Workout {workout.order}</div>
      <div className="text-xs text-gray-600">
        Warmup: {workout.warmup?.instructions || "None"}
      </div>
      <div className="text-xs text-gray-600">
        Cooldown: {workout.cooldown?.instructions || "None"}
      </div>
      <div className="text-xs text-gray-600">
        Num Exercises: {workout.program_workout_exercises.length}
      </div>
    </div>
  );
};

export default ProgramWorkoutCard;