import { useRef } from "react";
import {
  useDrag,
  useDrop,
  DragSourceMonitor,
  DropTargetMonitor,
} from "react-dnd";
import { ProgramWorkout } from "../types/models";
import Checkbox from '@mui/material/Checkbox';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import { useProgramStoreActions } from "../hooks/useProgramStoreActions";
import { useProgramData } from "../hooks/useProgramStoreData";
import TooltipIconButton from "../../core/components/TooltipIconButton";

export interface DragItem {
  id: number;
  week: number;
  day: number;
  index: number;
}

interface ProgramWorkoutCardProps {
  workout: ProgramWorkout;
  index: number;
  week: number;
  day: number;
  canDrag: boolean;
  isLastWorkout: boolean;
  moveWorkout: (
    workoutId: number,
    toWeek: number,
    toDay: number,
    toIndex: number
  ) => void;
  onDrop: () => void;
  onSelect: (workoutId: number, shiftKey: boolean, clickedPosition: number) => void;
  onEditWorkout: (index: number, exerciseIndex?: number) => void;
}

const WorkoutCard = ({
  workout,
  index,
  week,
  day,
  canDrag,
  isLastWorkout,
  moveWorkout,
  onDrop,
  onSelect,
  onEditWorkout
}: ProgramWorkoutCardProps) => {
  const cardRef = useRef<HTMLButtonElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);

  const { setCopiedWorkoutIds } = useProgramStoreActions();
  const { selectedWorkoutIds } = useProgramData();

  const isSelected = selectedWorkoutIds.includes(workout.id);

  // 1) Drag Source
  const [{ isDragging }, drag, preview] = useDrag({
    type: "WORKOUT",
    item: { id: workout.id, week, day, index } as DragItem,
    canDrag: () => canDrag,
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // 2) Drop Target
  const [, drop] = useDrop<DragItem, void, {}>({
    accept: "WORKOUT",
    hover(item, monitor: DropTargetMonitor<DragItem, void>) {
      if (!cardRef.current) return;
      if (item.id === workout.id) return; // no-op if same card

      // Calculate vertical middle
      const { top, bottom } = cardRef.current.getBoundingClientRect();
      const hoverMiddleY = (bottom - top) / 2;

      // Pointer position relative to card top
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - top;

      // Only perform the move when crossing half the height:
      // - dragging downward, only when pointer is below middle
      // - dragging upward,   only when pointer is above middle
      if (item.index < index && hoverClientY < hoverMiddleY) return;
      if (item.index > index && hoverClientY > hoverMiddleY) return;

      // Perform the move
      moveWorkout(item.id, week, day, index);

      // Mutate the drag item so that subsequent hovers know the new index
      item.index = index;
      item.week = week;
      item.day = day;
    },
    drop: onDrop,
  });

  // attach both drag & drop to the same node
  drop(cardRef);
  preview(cardRef);
  if (canDrag) {
    drag(handleRef);
  }

  return (
    <button
      ref={cardRef}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={`text-start border-b py-1 bg-white cursor-pointer pb-0 ${isLastWorkout ? 'border-b-0' : ''}`}
      onClick={() => onEditWorkout(index)}
    >
      <div className="workout-card-header flex items-start mt-1 mb-2 mx-1">
        <Checkbox 
          checked={isSelected}
          disableRipple 
          size="medium" 
          sx={{p:0, pb: 1, pr: 0.5}} 
          onClick={(e) => {
            e.stopPropagation();
            const clickedPosition = (week - 1) * 7 + day;
            onSelect(workout.id, e.shiftKey, clickedPosition);
          }}
        />
        <span className="text-[15px] font-semibold flex-grow mr-3">{workout.name || `Workout`}</span>
        <div className="copy-and-move-buttons flex items-center">
          <TooltipIconButton
            tooltipContent="Copy workout"
            tooltipPosition="bottom"
            onClick={(e) => {
              e.stopPropagation();
              setCopiedWorkoutIds([workout.id])
            }}
            buttonClassName="cursor-pointer"
            aria-label="Copy workout"
          >
            <ContentCopyIcon sx={{fontSize: 18}}/>
          </TooltipIconButton>
          <button 
            ref={handleRef} 
            disabled={!canDrag}
            aria-label="move workout"
            className={`ml-1 ${canDrag ? 'cursor-move' : 'cursor-not-allowed opacity-50'}`}
          >
            <OpenWithIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
      </div>

      {workout.warmup?.instructions && 
        <div className="flex flex-col px-2">
          <div 
            className="text-[10px] text-gray-600"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical" as const,
              overflow: "hidden",
              wordBreak: "break-word",
              whiteSpace: "pre-line"
            }}
          >
            {workout.warmup.instructions}
          </div>
          <div 
            className="divider mt-1 w-full border-t border-gray-400" 
          />
        </div>
      }

      {workout.program_workout_exercises?.length > 0 && (
        <div>
          {workout.program_workout_exercises.map((ex, idx) => (
            <button 
              type="button"
              key={ex.id ?? idx} 
              className="text-start w-full flex flex-col py-2 px-2 min-h-15 hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                onEditWorkout(index, idx); // tells form to focus exercise idx
              }}
            >
              <div className="exercise-title text-[13px] font-semibold">
                {`${ex.order}) ${ex.exercise.name}`}
              </div>
              <p className="text-xs text-gray-600">
                {ex.instructions}
              </p>
            </button>
          ))}
        </div>
      )}

      {workout.cooldown?.instructions && 
        <div className="flex flex-col px-2 pb-8">
          <div className="divider mb-1 w-full border-t border-gray-400" />
          <div 
            className="text-[10px] text-gray-600"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical" as const,
              overflow: "hidden",
              wordBreak: "break-word",
              whiteSpace: "pre-line"
            }}
          >
            {workout.cooldown.instructions}
          </div>
        </div>
      }
    </button>
  );
};

export default WorkoutCard;
