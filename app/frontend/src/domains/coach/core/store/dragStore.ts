import { create } from "zustand";
import { ProgramWorkout } from "../../programs/types";

interface DraggedWorkout {
  workout: ProgramWorkout;
  from: { week: number; day: number; index: number };
}

interface DropTarget {
  week: number;
  day: number;
  index: number;
}

interface DragStore {
  draggedWorkout: DraggedWorkout | null;
  dropTarget: DropTarget | null;
  setDraggedWorkout: (d: DraggedWorkout | null) => void;
  setDropTarget: (t: DropTarget | null) => void;
}


export const useDragStore = create<DragStore>((set) => ({
  draggedWorkout: null,
  dropTarget: null,
  setDraggedWorkout: (d) => set({ draggedWorkout: d }),
  setDropTarget: (t) => set({ dropTarget: t }),
}));