import { useEffect } from "react";
import { dragAndDrop } from "@formkit/drag-and-drop/react";
import type { ExerciseStackItem } from "../types/ui";

type Updater =
  | ExerciseStackItem[]
  | ((prev: ExerciseStackItem[]) => ExerciseStackItem[]);

export function useExerciseDragAndDrop(
  listRef: React.RefObject<HTMLDivElement>,
  items: ExerciseStackItem[],
  commit: (next: Updater) => void
) {
  useEffect(() => {
    if (!listRef.current) return;

    dragAndDrop<HTMLDivElement, ExerciseStackItem>({
      parent: listRef,
      state: [items, commit],
      dragHandle: ".exercise-drag-handle",
      draggingClass: "border-1 bg-white py-2 opacity-70",
      dragPlaceholderClass: "opacity-30",
    });
  }, [listRef, items, commit]);
}
