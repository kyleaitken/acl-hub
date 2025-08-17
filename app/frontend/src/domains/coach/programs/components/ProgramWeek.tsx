import { useMemo } from "react";
import ProgramDay from "./ProgramDay";
import { ProgramWorkout } from "../types/models";

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
  deleteWeek: (week: number) => void;
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
  deleteWeek
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
            onDeleteWeek={() => deleteWeek(week)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgramWeek;
