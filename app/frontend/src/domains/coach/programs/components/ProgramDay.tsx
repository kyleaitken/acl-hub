import { useState } from "react";
import { ProgramWorkout } from "../types";
import ProgramWorkoutCard from "./ProgramWorkoutCard";
import { useParams } from "react-router-dom";
import { useProgramActions } from "../hooks/useProgramActions";
import toast from "react-hot-toast";

interface ProgramDayProps {
  dayIndex: number;
  isLastWeek: boolean;
  week: number;
  workouts: ProgramWorkout[];
}

const ProgramDay = ({ dayIndex, isLastWeek, week, workouts }: ProgramDayProps) => {
  const [localWorkouts, setLocalWorkouts] = useState(workouts);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const { programId } = useParams();
  const id = Number(programId);
  const { updateWorkoutPositions } = useProgramActions();

  const isLastDay = dayIndex === 6;
  const isFirstDay = dayIndex === 0;
  const borderRight = !isLastDay ? "border-r-0" : "";
  const borderBottom = !isLastWeek ? "border-b-0" : "";

  const getDayLabel = (dayIndex: number) => `Day ${(week - 1) * 7 + dayIndex + 1}`;

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...localWorkouts];
    const [draggedWorkout] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedWorkout);

    setDraggedIndex(index);
    setLocalWorkouts(updated);
  };

  const handleDrop = async () => {
    setDraggedIndex(null);

    const updatedWorkouts = localWorkouts.map((w, i) => ({
      id: w.id,
      day: w.day,
      week: w.week,
      order: i,
    }));

    try {
      await updateWorkoutPositions({programId: id, workouts_positions: updatedWorkouts });
      toast.success("Workout order updated");
    } catch (err) {
      console.error("There was an error updating the program's workouts ordering", err);
      toast.error("Failed to update program's workouts ordering")
    }
  };

  return (
    <div
      id={`day-${dayIndex + 1}`}
      className={`flex flex-col flex-1 min-h-[450px] border border-gray-400 ${borderRight} ${borderBottom}`}
    >
      <div className="text-md bg-gray-300 font-semibold px-2 py-1 flex justify-between">
        {isFirstDay ? <div>Week {week}</div> : <div />}
        {getDayLabel(dayIndex)}
      </div>

      <div className="flex-grow bg-white flex flex-col p-2">
        {localWorkouts.map((workout, index) => (
          <div
            key={workout.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={handleDrop}
          >
            <ProgramWorkoutCard workout={workout} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramDay;
