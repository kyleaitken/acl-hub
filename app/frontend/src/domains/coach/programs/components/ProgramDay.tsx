// src/components/ProgramDay.tsx
import { useDrop } from "react-dnd";
import ProgramWorkoutCard, { DragItem } from "./ProgramWorkoutCard";
import { ProgramWorkout } from "../types";

interface ProgramDayProps {
  dayIndex: number;
  isLastWeek: boolean;
  week: number;
  workouts: ProgramWorkout[];
  moveWorkout: (
    workoutId: number,
    toWeek: number,
    toDay: number,
    toIndex: number
  ) => void;
  onDrop: () => void;
}

const ProgramDay = ({
  dayIndex,
  isLastWeek,
  week,
  workouts,
  moveWorkout,
  onDrop,
}: ProgramDayProps) => {
  const [, drop] = useDrop({
    accept: "WORKOUT",
    hover(item: DragItem) {
      const toIndex = workouts.length;
      if (
        item.week === week &&
        item.day === dayIndex + 1 &&
        item.index === toIndex
      ) {
        return;
      }
      moveWorkout(item.id, week, dayIndex + 1, toIndex);
      item.week = week;
      item.day = dayIndex + 1;
      item.index = toIndex;
    },
    drop: onDrop,
  });

  const label = `Day ${(week - 1) * 7 + dayIndex + 1}`;
  return (
    <div
      ref={drop}
      className={`flex flex-col flex-1 min-h-[450px] border border-gray-400 ${
        dayIndex === 6 ? "" : "border-r-0"
      } ${isLastWeek ? "" : "border-b-0"}`}
    >
      <div className="text-md bg-gray-300 font-semibold px-2 py-1">
        {dayIndex === 0 ? `Week ${week}` : ""} {label}
      </div>
      <div className="flex-grow bg-white flex flex-col p-2">
        {workouts.map((w, i) => (
          <ProgramWorkoutCard
            key={w.id}
            workout={w}
            index={i}
            week={week}
            day={dayIndex + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgramDay;
