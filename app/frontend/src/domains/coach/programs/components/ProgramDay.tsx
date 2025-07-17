import { ProgramWorkout } from "../types";
import ProgramWorkoutCard from "./ProgramWorkoutCard";
import { useDragStore } from "../../core/store/dragStore";

interface ProgramDayProps {
  dayIndex: number;
  isLastWeek: boolean;
  week: number;
  workouts: ProgramWorkout[];
  onDropToDay: (targetWeek: number, targetDay: number) => void;
}

const ProgramDay = ({ dayIndex, isLastWeek, week, workouts, onDropToDay }: ProgramDayProps) => {
  const {setDraggedWorkout, setDropTarget} = useDragStore();

  const isLastDay = dayIndex === 6;
  const isFirstDay = dayIndex === 0;
  const borderRight = !isLastDay ? "border-r-0" : "";
  const borderBottom = !isLastWeek ? "border-b-0" : "";

  const getDayLabel = (dayIndex: number) => `Day ${(week - 1) * 7 + dayIndex + 1}`;

  const handleDayDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
  };

  const handleDayDrop = () => {
    if (useDragStore.getState().draggedWorkout) {
      onDropToDay(week, dayIndex + 1); 
    }
  };

  return (
    <div
      id={`day-${dayIndex + 1}`}
      className={`flex flex-col flex-1 min-h-[450px] border border-gray-400 ${borderRight} ${borderBottom}`}
      onDragOver={handleDayDragOver}
      onDrop={handleDayDrop}
    >
      <div className="text-md bg-gray-300 font-semibold px-2 py-1 flex justify-between">
        {isFirstDay ? <div>Week {week}</div> : <div />}
        {getDayLabel(dayIndex)}
      </div>

      <div className="flex-grow bg-white flex flex-col p-2">
        {workouts.map((workout, i) => (
          <div
            key={workout.id}
            draggable
            onDragStart={() =>
              setDraggedWorkout({
                workout,
                from: {week, day: dayIndex + 1, index: i}
              })
            } 
            onDragOver={(e) => {
              e.preventDefault();
              setDropTarget({ week, day: dayIndex + 1, index: i });
            }}
          >
            <ProgramWorkoutCard workout={workout} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramDay;
