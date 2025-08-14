import { useEffect, useMemo, useRef, useState } from "react";
import { useProgramStoreActions } from "./useProgramStoreActions";
import { useProgramData, useProgramDetails } from "./useProgramStoreData";
import { ProgramWorkout } from "../types/models";
import toast from "react-hot-toast";
import { useShiftRangeSelect } from "../../core/hooks/useShiftRangeSelect";

export function useProgramPageActions(programId: number) {
  const [localWorkouts, setLocalWorkouts] = useState<ProgramWorkout[]>([]);
  const pasteTarget = useRef<{week:number;day:number} | null>(null);
  const prevWorkouts = useRef<ProgramWorkout[] | null>(null);

  const {
    fetchProgram,
    updateWorkoutPositions,
    deleteWorkoutsFromProgram,
    bulkCopyWorkoutsToProgram,
    updateProgramDetails,
    setSelectedWorkoutIds,
    deleteWeekFromProgram
  } = useProgramStoreActions();

  const { copiedWorkoutIds, selectedWorkoutIds } = useProgramData();
  const { program } = useProgramDetails(programId);

  // 1) Fetch + reset on unmount
  useEffect(() => {
    fetchProgram(programId);
    return () => { setSelectedWorkoutIds([]) };
  }, [programId]);

  // 2) Map server → local for drag previews
  useEffect(() => {
    if (program?.program_workouts) {
      setLocalWorkouts(program.program_workouts);
    }
  }, [program?.program_workouts]);

  // 3) Toast on copy workouts
  useEffect(() => {
    if (copiedWorkoutIds.length)
      toast.success(`${copiedWorkoutIds.length} workout(s) copied!`);
  }, [copiedWorkoutIds]);

  // 4) Paste listener
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      if (!copiedWorkoutIds.length || !pasteTarget.current) return;
      e.preventDefault();
      const { week, day } = pasteTarget.current;

      bulkCopyWorkoutsToProgram({
        programId,
        workoutIds: copiedWorkoutIds,
        targetWeek: week,
        targetDay: day,
      })
        .then(() => toast.success("Workouts pasted"))
        .catch(() => toast.error("Paste failed"));
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [copiedWorkoutIds]);

  // 5) Drag preview splice
  const moveWorkout = (
    workoutId: number,
    toWeek: number,
    toDay: number,
    toIndex: number
  ) => {
    if (!prevWorkouts.current) {
      prevWorkouts.current = localWorkouts.map((w) => ({...w}));
    }
    setLocalWorkouts((prev) => {
      const dragged = prev.find((w) => w.id === workoutId);
      if (!dragged) return prev;

      let otherWorkouts = prev.filter((w) => w.id !== workoutId);

      const sortedDayWorkoutStack = otherWorkouts
        .filter((w) => w.week === toWeek && w.day === toDay)
        .sort((a, b) => a.order - b.order);

      // add dragged workout to desired index
      sortedDayWorkoutStack.splice(toIndex, 0, { ...dragged, week: toWeek, day: toDay });

      const reorderedWorkoutStack = sortedDayWorkoutStack.map((w, i) => ({ ...w, order: i }));

      otherWorkouts = [
        ...otherWorkouts.filter((w) => !(w.week === toWeek && w.day === toDay)), // filter out target day workout stack
        ...reorderedWorkoutStack, // add in target day workout stack
      ];
      return otherWorkouts;
    });
  };

  // 6) Commit on drop
  const handleDrop = async () => {
    if (!program) return;
    try {
      await updateWorkoutPositions({
        programId: program.id,
        workouts_positions: localWorkouts.map(w => ({
          id: w.id, week: w.week, day: w.day, order: w.order
        })),
      });
      toast.success("Workouts updated");
    } catch (err) {
      if (prevWorkouts.current) {
        setLocalWorkouts(prevWorkouts.current.map((w) => ({...w})));
      }
      toast.error("Update failed");
      console.log("Error occurred while trying to update workouts: ", err);
    } finally {
      prevWorkouts.current = null;
    }
  };

  const handleShiftSelect = useShiftRangeSelect<ProgramWorkout, number>({
    items: program?.program_workouts,
    selectedIds: selectedWorkoutIds,
    onChange: setSelectedWorkoutIds,
    getId: (w) => w.id,
    getPosition: (w) => (w.week - 1) * 7 + w.day,
  });

  // 7) Delete selected workouts
  const deleteSelected = () => {
    if (!selectedWorkoutIds.length) return;
    deleteWorkoutsFromProgram(program.id, selectedWorkoutIds)
      .then(() => toast.success("Deleted!"))
      .catch((err) => { 
        toast.error("Delete failed");
        console.error("Error while trying to delete selected workouts: ", err);
      })
      .finally(() => setSelectedWorkoutIds([]));
  };

  // 8) Copy last week
  const copyLastWeek = async () => {
    const last = program!.num_weeks;
    const weekWorkouts = localWorkouts.filter(w => w.week === last);

    if (!weekWorkouts.length) {
      return addWeek();
    }

    try {
      await bulkCopyWorkoutsToProgram({
        programId,
        workoutIds: weekWorkouts.map(w => w.id),
        targetWeek: last+1,
        targetDay: weekWorkouts[0].day,
      });
      toast.success("Program updated!");
    } catch (err) {
      toast.error("Copy failed");
      console.error("Error occurred while trying to copy workouts: ", err);
    }
  };

  const deleteWeek = async (weekNumber: number) => {
    try {
      await deleteWeekFromProgram(programId, weekNumber);
      toast.success("Week removed");
    } catch (err) {
      console.error("Error occurred while trying to remove week: ", err);
      toast.error("Failed to remove week");
    }
  }

  // 9) Add / remove empty week
  const addWeek = async () => {
    try {
      await updateProgramDetails({ programId, num_weeks: program!.num_weeks+1 });
      toast.success("Week added");
    } catch (err) {
      console.error("Error occurred while trying to add a week: ", err);
      toast.error("Failed to add week");
    }
  };

  const removeWeek = async () => {
    try {
      await updateProgramDetails({ programId, num_weeks: program!.num_weeks-1 });
      toast.success("Week removed");
    } catch (err) {
      console.error("Error occurred while trying to remove week: ", err);
      toast.error("Failed to remove week");
    }
  };

  // 10) Group workouts by week
  const workoutsByWeek = useMemo(() => {
    const grouped: Record<number, ProgramWorkout[]> = {};
    for (const w of localWorkouts) {
      (grouped[w.week] ||= []).push(w);
    }
    return grouped;
  }, [localWorkouts]);

  // 11) Hover target setter
  const onDayHover = (week: number, day: number) => {
    pasteTarget.current = { week, day };
  };

  return {
    program,
    localWorkouts,
    workoutsByWeek,
    moveWorkout,
    handleDrop,
    onDayHover,
    deleteSelected,
    copyLastWeek,
    addWeek,
    deleteWeek,
    removeWeek,
    handleSelectAll: () => setSelectedWorkoutIds(program!.program_workouts.map(w => w.id)),
    handleShiftSelect,
  };
}
