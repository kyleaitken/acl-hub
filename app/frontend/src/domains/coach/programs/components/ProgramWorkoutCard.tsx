// src/components/ProgramWorkoutCard.tsx
import { useDrag, DragSourceMonitor } from "react-dnd";
import { ProgramWorkout } from "../types";

export interface DragItem {
  id: number;
  week: number;
  day: number;
  index: number;
}

interface ProgramWorkoutCardProps {
  workout: ProgramWorkout;
  index: number;
  week: number;
  day: number;
}

const ProgramWorkoutCard = ({
  workout,
  index,
  week,
  day,
}: ProgramWorkoutCardProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: "WORKOUT",
    item: { id: workout.id, week, day, index } as DragItem,
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}
      className="mb-2 p-2 border rounded bg-white shadow"
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
