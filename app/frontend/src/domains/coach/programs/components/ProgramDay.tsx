import { useEffect, useState } from "react";
import WorkoutCard from "./WorkoutCard";
import { ProgramWorkout, WorkoutFormItem, WorkoutStackItem } from "../types";
import { useProgramData } from "../hooks/useProgramStoreData";
import WorkoutForm from "./WorkoutForm";
import { useProgramActions } from "../hooks/useProgramStoreActions";
import { useWorkoutDrop } from '../hooks/useWorkoutDrop';
import ProgramDayHeader from "./ProgramDayHeader";
import { useProgramDayActions } from "../hooks/useProgramDayActions";

interface ProgramDayProps {
  programId: number;
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
  onHover: (week: number, day: number) => void;
  onSelectWorkout: (workoutId: number, shiftKey: boolean, clickedPosition: number) => void;
}

const ProgramDay = ({
  programId,
  dayIndex,
  isLastWeek,
  week,
  workouts,
  moveWorkout,
  onDrop,
  onHover,
  onSelectWorkout
}: ProgramDayProps) => {
  const [stack, setStack] = useState<WorkoutStackItem[]>(() => workouts.map(w => ({ __type: 'card', ...w })));
  const { copiedWorkoutIds, isEditingWorkout } = useProgramData(); // TODO maybe have a flag in state like idsCopied so that I don't need to pull this into each program day
  const {setIsEditingWorkout} = useProgramActions();
  const { pasteCopied, submitNew } 
    = useProgramDayActions({ programId: programId, week, day: dayIndex+1 });

  const { dropContainer, dropPlaceholder } = useWorkoutDrop({
    week,
    day: dayIndex + 1,
    itemsLength: workouts.length,
    moveWorkout,
    onDrop,
  });

  useEffect(() => {
    // early return if editing, don't need to re-render the stack
    if (isEditingWorkout) {
      return;
    }
    setStack(workouts.map(w => ({ __type: "card", ...w })));
  }, [workouts, isEditingWorkout]);

  const handleAddNewWorkout = () => {
    setIsEditingWorkout(true);
    const tempId = crypto.randomUUID();
    const newForm: WorkoutFormItem = {
      __type: "form",
      tempId,
      initialData: {
        day: dayIndex + 1,
        week,
        order: 0,
      },
    };
  
    setStack(prev => [
      newForm,
      ...prev.map(item =>
        item.__type === "card"
          ? { ...item, order: item.order + 1 }
          : item
      ),
    ]);
  };

  // const handleEditWorkoutCard = (id: number) => {
  //   // when clicked, temporarily replace the workout card with a workout form that's given initial data?
  // };

  const handleCancelCreateWorkout = (index: number) => {
    setIsEditingWorkout(false);
    setStack(prev => prev.filter((_, i) => i !== index));
  };

  const isLastDay = dayIndex === 6;
  const borderRight = isLastDay ? "" : "border-r-0";
  const borderBottom = isLastWeek ? "" : "border-b-0";
  const label = `Day ${(week - 1) * 7 + dayIndex + 1}`;

  return (
    <div
      ref={dropContainer}            
      id={`day-${dayIndex + 1}`}
      className={`flex flex-col flex-1 min-h-[450px] border border-gray-400 ${borderRight} ${borderBottom}`}
      onMouseEnter={() => onHover(week, dayIndex + 1)}
    >
      <ProgramDayHeader 
        label={label}
        isFirstDay={dayIndex === 0}
        week={week}
        showPasteWorkouts={copiedWorkoutIds.length > 0}
        onPasteWorkouts={pasteCopied}
        onAddWorkout={handleAddNewWorkout}
      />
      <div className="flex-grow bg-white flex flex-col py-0 px-0">
        {stack.map((w, i) => {
          if (w.__type === 'form') {
            return (
              <WorkoutForm 
                key={w.tempId} 
                stackIndex={i} 
                existingExercise={false} 
                handleCancelCreate={handleCancelCreateWorkout} 
                handleAddNewWorkout={submitNew}
              />
            )
          } else {
            return (
              <WorkoutCard
                key={w.id}
                workout={w}
                index={i}
                week={week}
                day={dayIndex + 1}
                moveWorkout={moveWorkout}
                isLastWorkout={i === stack.length - 1}
                onDrop={onDrop}
                canDrag={!isEditingWorkout} // disable dragging while editing workouts
                onSelect={onSelectWorkout}
              />
            )
          }
        })}

        <div
          ref={dropPlaceholder}
          style={{ height: 20 }}
          className="mt-2 flex-grow"
        />
      </div>
    </div>
  );
};

export default ProgramDay;
