import { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import WorkoutCard, { DragItem } from "./WorkoutCard";
import { ProgramWorkout, RawWorkoutData, WorkoutFormItem, WorkoutStackItem } from "../types";
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useProgramData } from "../hooks/useProgramData";
import { Tooltip } from "@mui/material";
import WorkoutForm from "./WorkoutForm";
import { useParams } from "react-router-dom";
import { useProgramActions } from "../hooks/useProgramActions";
import { buildWorkoutPayload } from "../utils";

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
  const [stack, setStack] = useState<WorkoutStackItem[]>(() =>
    workouts.map(w => ({ __type: 'card', ...w }))
  );

  const { copiedWorkoutIds, isEditingWorkout } = useProgramData();
  const { addWorkoutToProgram, setIsEditingWorkout } = useProgramActions();
  const { programId } = useParams<{ programId: string }>();
  const id = Number(programId);

  useEffect(() => {
    // early return if editing, don't need to re-render the stack
    if (isEditingWorkout) {
      return;
    }
    setStack(workouts.map(w => ({
      __type: "card",
      ...w,
    })));
  }, [workouts, isEditingWorkout]);

  // Container drop: final drop only, shallow so it won't fire when over cards
  const [, dropContainer] = useDrop<DragItem, void, {}>({
    accept: "WORKOUT",
    drop(item, monitor) {
      // only handle actual shallow drops (not ones bubbling from cards)
      if (!monitor.isOver({ shallow: true })) return;
      const toIndex = workouts.length;
      moveWorkout(item.id, week, dayIndex + 1, toIndex);
      onDrop();
    },
  });

  const [{ }, dropPlaceholder] = useDrop<
    DragItem,
    void,
    { isOverPlaceholder: boolean }
  >({
    accept: "WORKOUT",
    collect: (monitor) => ({
      isOverPlaceholder: monitor.isOver({ shallow: true }),
    }),
    hover(item) {
      const toIndex = workouts.length;
      // already at correct spot?
      if (
        item.week === week &&
        item.day === dayIndex + 1 &&
        item.index === toIndex
      ) {
        return;
      }
      // preview the append
      moveWorkout(item.id, week, dayIndex + 1, toIndex);
      item.index = toIndex;
      item.week = week;
      item.day = dayIndex + 1;
    },
  });

  const isLastDay = dayIndex === 6;
  const borderRight = isLastDay ? "" : "border-r-0";
  const borderBottom = isLastWeek ? "" : "border-b-0";
  const label = `Day ${(week - 1) * 7 + dayIndex + 1}`;

  const handlePasteWorkoutsClicked = () => {
    // TODO
  };

  const handleAddWorkoutClicked = () => {
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

  const handleAddNewWorkout = async (rawData: RawWorkoutData) => {
    setIsEditingWorkout(false);
    const payload = buildWorkoutPayload(rawData, week, dayIndex + 1, /*order*/ 0);
    await addWorkoutToProgram({ programId: id, program_workout: payload })
  }

  const handleEditWorkoutCard = (id: number) => {
    // when clicked, temporarily replace the workout card with a workout form that's given initial data?
  };

  const handleCancelCreateWorkout = (index: number) => {
    setIsEditingWorkout(false);
    setStack(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      ref={dropContainer}            
      id={`day-${dayIndex + 1}`}
      className={`flex flex-col flex-1 min-h-[450px] border border-gray-400 ${borderRight} ${borderBottom}`}
    >
      <div className="text-md bg-[#d0ccdb] font-semibold px-2 py-1 flex items-center justify-between">
        <span>{dayIndex === 0 && `Week ${week} `}</span>
        <div className="flex items-center justify-center">
          {copiedWorkoutIds.length > 0 &&
          <Tooltip title="Paste workout(s)" placement="top">
            <button 
              aria-label="Paste workouts"
              type="button"
              className="cursor-pointer pb-0.5 mr-2"
              onClick={handlePasteWorkoutsClicked}
            >
              <ContentPasteIcon 
                sx={{
                  fontSize: '18px',
                  "&:hover": {
                    color: "#757575" 
                  }
                }}
              />
            </button>
          </Tooltip>
          }
          <Tooltip title="Add workout" placement="top">
            <button 
              aria-label="Add workout"
              type="button"
              className="cursor-pointer pb-0.5 mr-2"
              onClick={handleAddWorkoutClicked}
            >
              <AddCircleIcon 
                sx={{
                  fontSize: '20px',
                  "&:hover": {
                    color: "#757575" 
                  }
                }}
              
              />
            </button>
          </Tooltip>
          <span>{label}</span>
        </div>
      </div>
      <div className="flex-grow bg-white flex flex-col py-2 px-1">
        {stack.map((w, i) => {
          if (w.__type === 'form') {
            return (
              <WorkoutForm 
                key={w.tempId} 
                stackIndex={i} 
                existingExercise={false} 
                handleCancelCreate={handleCancelCreateWorkout} 
                handleAddNewWorkout={handleAddNewWorkout}
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
                onDrop={onDrop}
                canDrag={!isEditingWorkout}
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
