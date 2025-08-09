import { useDrop } from "react-dnd";
import { DragItem } from "../components/WorkoutCard";

export interface UseWorkoutDropOpts {
  week: number;
  day: number;
  itemsLength: number;
  moveWorkout: (workoutId: number, toWeek: number, toDay: number, toIndex: number) => void;
  onDrop: () => void;
}

export function useWorkoutDrop({
  week,
  day,
  itemsLength,
  moveWorkout,
  onDrop,
}: UseWorkoutDropOpts) {
  // the “container” drop target (for shallow drops)
  const [, dropContainer] = useDrop<DragItem, void, {}>({
    accept: "WORKOUT",
    drop(item, monitor) {
      if (!monitor.isOver({ shallow: true })) return;
      const toIndex = itemsLength;
      moveWorkout(item.id, week, day, toIndex);
      onDrop();
    },
  });

  // the “placeholder” hover target (to preview inserting at the end)
  const [, dropPlaceholder] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: "WORKOUT",
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
    hover(item) {
      const toIndex = itemsLength;
      if (
        item.week === week &&
        item.day === day &&
        item.index === toIndex
      ) {
        return;
      }
      moveWorkout(item.id, week, day, toIndex);
      item.index = toIndex;
      item.week = week;
      item.day = day;
    },
  });

  return { dropContainer, dropPlaceholder };
}
