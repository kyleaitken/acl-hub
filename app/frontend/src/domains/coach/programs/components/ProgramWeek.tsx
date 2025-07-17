// src/components/ProgramWeek.tsx
import { useMemo } from "react";
import ProgramDay from "./ProgramDay";
import { ProgramWorkout } from "../types";

interface ProgramWeekProps {
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
}

const ProgramWeek = ({
  week,
  workouts,
  isLastWeek,
  moveWorkout,
  onDrop,
}: ProgramWeekProps) => {
  
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

  return (
    <div className="w-full" id={`week-${week}`}>
      <div className="flex">
        {[...Array(7)].map((_, dayIndex) => (
          <ProgramDay
            key={dayIndex}
            dayIndex={dayIndex}
            week={week}
            isLastWeek={isLastWeek}
            workouts={byDay[dayIndex + 1] || []}
            moveWorkout={moveWorkout}
            onDrop={onDrop}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgramWeek;
