// src/components/ProgramWeek.tsx
import { useMemo } from "react";
import ProgramDay from "./ProgramDay";
import { ProgramWorkout } from "../types/models";
import DeleteIcon from '@mui/icons-material/Delete';
import { useProgramData } from "../hooks/useProgramStoreData";

interface ProgramWeekProps {
  programId: number;
  week: number;
  workouts: ProgramWorkout[];
  isLastWeek: boolean;
  moveWorkout: (
    workoutId: number,
    toWeek: number,
    toDay: number,
    toIndex: number
  ) => void;
  onDrop: () => void;
  onDayHover: (week: number, day: number) => void;
  onSelectWorkout: (workoutId: number, shiftKey: boolean, clickedPosition: number) => void;
  deleteLastWeek: () => void;
}

const ProgramWeek = ({
  programId,
  week,
  workouts,
  isLastWeek,
  moveWorkout,
  onDrop,
  onDayHover,
  onSelectWorkout,
  deleteLastWeek
}: ProgramWeekProps) => {
  const { isEditingWorkout } = useProgramData();
  
  const byDay = useMemo(() => {
    const groupedWorkouts: Record<number, ProgramWorkout[]> = {};
    workouts.forEach((w) => {
      (groupedWorkouts[w.day] ||= []).push(w);
    });
    Object.values(groupedWorkouts).forEach((arr) =>
      arr.sort((a, b) => a.order - b.order)
    );
    return groupedWorkouts;
  }, [workouts]);

  const showDeleteWeekButton = isLastWeek && !isEditingWorkout && workouts.length === 0;

  return (
    <div className="w-full relative" id={`week-${week}`}>
      <div className="flex">
        {[...Array(7)].map((_, dayIndex) => (
          <ProgramDay
            key={dayIndex}
            programId={programId}
            dayIndex={dayIndex}
            week={week}
            isLastWeek={isLastWeek}
            workouts={byDay[dayIndex + 1] || []}
            moveWorkout={moveWorkout}
            onDrop={onDrop}
            onHover={onDayHover}
            onSelectWorkout={onSelectWorkout}
          />
        ))}
      </div>
      {showDeleteWeekButton &&
        <div
          className="flex flex-col absolute top-45 -left-5 justify-center h-25 w-10 bg-[#242526]/90 px-1 py-3 rounded"
        >
          <button
            type="button"
            className="cursor-pointer py-5"
            onClick={deleteLastWeek}
          >
            <DeleteIcon sx={{color: 'white', fontSize: '30px'}}/>
          </button>
        </div>
      }
    </div>
  );
};

export default ProgramWeek;
