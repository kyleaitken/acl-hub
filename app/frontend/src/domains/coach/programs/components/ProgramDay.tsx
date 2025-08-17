import { useEffect, useState } from "react";
import WorkoutCard from "./WorkoutCard";
import { CreateFormItem, EditFormItem, WorkoutStackItem } from "../types/ui";
import { ProgramWorkout } from "../types/models";
import { useProgramData } from "../hooks/useProgramStoreData";
import WorkoutForm from "./WorkoutForm";
import { useProgramStoreActions } from "../hooks/useProgramStoreActions";
import { useWorkoutDrop } from '../hooks/useWorkoutDrop';
import ProgramDayHeader from "./ProgramDayHeader";
import { useProgramDayActions } from "../hooks/useProgramDayActions";
import { isCardItem, isCreateForm, isEditForm } from "../utils";
import toast from "react-hot-toast";
import { sortExercisesByOrder } from "../utils/workoutUtils";

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
  onDeleteWeek: () => void;
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
  onSelectWorkout,
  onDeleteWeek
}: ProgramDayProps) => {

  const makeCard = (w: ProgramWorkout) => ({
    __type: "card" as const,
    ...w,
    program_workout_exercises: [...(w.program_workout_exercises ?? [])].sort(sortExercisesByOrder),
  });

  const [stack, setStack] = useState<WorkoutStackItem[]>(() => workouts.map(makeCard));
  const { copiedWorkoutIds, isEditingWorkout } = useProgramData();
  const {setIsEditingWorkout} = useProgramStoreActions();
  const { isSaving, pasteCopied, submitNewWorkout, submitWorkoutEdits } 
    = useProgramDayActions({ programId: programId, week, day: dayIndex+1 });
  const { deleteWorkoutsFromProgram } = useProgramStoreActions();

  const { dropContainer, dropPlaceholder } = useWorkoutDrop({
    week,
    day: dayIndex + 1,
    itemsLength: workouts.length,
    moveWorkout,
    onDrop,
  });
  
  useEffect(() => {
    if (isEditingWorkout) return;
    setStack(workouts.map(makeCard));
  }, [workouts, isEditingWorkout]);

  const handleAddNewWorkout = () => {
    setIsEditingWorkout(true);
    const tempId = crypto.randomUUID();
    const newForm: CreateFormItem = {
      __type: "form",
      mode: "create",
      tempId
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

  const handleEditWorkout = (index: number, exerciseIndex?: number) => {
    const card = stack[index];
    if (!isCardItem(card) || isEditingWorkout) return;
    setIsEditingWorkout(true);
  
    const editForm: EditFormItem = {
      __type: "form",
      mode: "edit",
      existingCard: card,
      focusExerciseIndex: exerciseIndex ?? null
    }

    setStack(s => s.map((w,i) => i === index ? editForm : w));
  };

  const handleCancelCreateOrEditWorkout = (index: number) => {
    setIsEditingWorkout(false);
    const form = stack[index];
    if (form.__type !== "form") return;

    if (form.mode === "edit") {
      const originalCard = form.existingCard;
      setStack(s =>
        s.map((w,i) => i === index ? originalCard : w)
      );
    } else {
      setStack(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleDeleteWorkoutClicked = (workoutId: number, stackIndex: number) => {
    try {
      deleteWorkoutsFromProgram(programId, [workoutId]);
      toast.success("Workout deleted")
    } catch (err) {
      handleCancelCreateOrEditWorkout(stackIndex);
      toast.error("Error deleting workout");
      console.error("Error occurred while deleting the workout");
    } finally {
      setStack(prev => prev.filter((_, i) => i !== stackIndex));
      setIsEditingWorkout(false);
    }
  };

  const isLastDay = dayIndex === 6;
  const borderRight = isLastDay ? "" : "border-r-0";
  const borderBottom = isLastWeek ? "" : "border-b-0";
  const label = `Day ${(week - 1) * 7 + dayIndex + 1}`;

  return (
    <div
      ref={dropContainer}            
      id={`day-${dayIndex + 1}`}
      className={`flex flex-col flex-1 min-h-80 border border-gray-400 ${borderRight} ${borderBottom}`}
      onMouseEnter={() => onHover(week, dayIndex + 1)}
    >
      <ProgramDayHeader 
        label={label}
        isFirstDay={dayIndex === 0}
        week={week}
        showPasteWorkouts={copiedWorkoutIds.length > 0}
        onPasteWorkouts={pasteCopied}
        onAddWorkout={handleAddNewWorkout}
        onDeleteWeek={onDeleteWeek}
      />
      <div className="flex-grow bg-white flex flex-col py-0 px-0">
        {stack.map((w, i) => {
          if (isCreateForm(w)) {
            return (
              <WorkoutForm
                key={w.tempId}
                mode="create"
                stackIndex={i}
                onCancel={handleCancelCreateOrEditWorkout}
                onSave={submitNewWorkout}
                isSaving={isSaving}
              />
            )
          } else if (isEditForm(w)) {
            return (
              <WorkoutForm
                key={w.existingCard.id}
                mode="edit"
                stackIndex={i}
                existingCard={w.existingCard}
                focusExerciseIndex={w.focusExerciseIndex}
                onCancel={handleCancelCreateOrEditWorkout}
                onSave={submitWorkoutEdits} 
                isSaving={isSaving}
                onDelete={handleDeleteWorkoutClicked}
              />
            )
          }
          else {
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
                onEditWorkout={handleEditWorkout}
              />
            )
          }
        })}

        <div
          ref={dropPlaceholder}
          style={{ height: stack.length === 0 ? "50%" : 50 }}
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default ProgramDay;
