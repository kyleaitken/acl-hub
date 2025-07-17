import { useMemo } from "react";
import { ProgramWorkout } from "../types";
import ProgramDay from "./ProgramDay";

interface ProgramWeekProps {
  week: number;
  workouts: ProgramWorkout[];
  isLastWeek: boolean;
  onDropToDay: (targetWeek: number, targetDay: number) => void;
}

const ProgramWeek = ({week, workouts, isLastWeek, onDropToDay}: ProgramWeekProps) => {

  const workoutsByDay: Record<number, ProgramWorkout[]> = useMemo(() => {
    const grouped: Record<number, ProgramWorkout[]> = {};
  
    for (const workout of workouts) {
      const day = workout.day;
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(workout);
    }
  
    // Sort each day's workouts by `order`
    for (const day in grouped) {
      grouped[day].sort((a, b) => a.order - b.order);
    }
  
    return grouped;
  }, [workouts]);

  return (
    <div className="w-full" id={`week-${week}`}>
      <div className="flex">
        {[...Array(7)].map((_, dayIndex) => {
          const daysWorkouts = workoutsByDay[dayIndex + 1] || [];
          return (
            <ProgramDay 
              key={dayIndex}
              dayIndex={dayIndex}
              week={week}
              isLastWeek={isLastWeek}
              workouts={daysWorkouts}
              onDropToDay={onDropToDay}
            />
          )
        })}
      </div>
    </div>
  )
};

export default ProgramWeek;