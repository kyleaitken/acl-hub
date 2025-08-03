import { useCallback } from "react";
import { BulkCopyWorkoutsDTO, RawWorkoutData } from "../types";
import { useProgramData } from "./useProgramStoreData";
import { useProgramActions } from "./useProgramStoreActions";
import { buildWorkoutPayload } from "../utils";
import toast from "react-hot-toast";

export function useProgramDayActions(opts: {
  programId: number;
  week: number;
  day: number;
}) {
  const { programId, week, day } = opts;
  const { copiedWorkoutIds } = useProgramData();
  const {
    bulkCopyWorkoutsToProgram,
    addWorkoutToProgram,
    setIsEditingWorkout,
  } = useProgramActions();

  const pasteCopied = useCallback(async () => {
    if (!copiedWorkoutIds.length) return;
    const dto: BulkCopyWorkoutsDTO = {
      programId,
      workoutIds: copiedWorkoutIds,
      targetWeek: week,
      targetDay: day,
    };
    try {
      await bulkCopyWorkoutsToProgram(dto);
      toast.success("Workouts copied!");
    } catch (err) {
      console.error(err);
      toast.error("Error copying workouts.");
    }
  }, [
    programId,
    week,
    day,
    copiedWorkoutIds,
    bulkCopyWorkoutsToProgram,
  ]);

  const submitNew = useCallback(
    async (raw: RawWorkoutData) => {
      setIsEditingWorkout(false);
      const payload = buildWorkoutPayload(raw, week, day, 0);
      try {
        await addWorkoutToProgram({
          programId,
          program_workout: payload,
        });
        toast.success("Workout added!");
      } catch (err) {
        console.error(err);
        toast.error("Error adding workout.");
      }
    },
    [programId, week, day, addWorkoutToProgram, setIsEditingWorkout]
  );

  return {
    pasteCopied,
    submitNew,
  };
}
