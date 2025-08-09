import { useCallback, useState } from "react";
import { BulkCopyWorkoutsDTO } from "../types/dtos";
import { RawWorkoutData } from "../types/ui";
import { useProgramData } from "./useProgramStoreData";
import { useProgramStoreActions } from "./useProgramStoreActions";
import { buildNewWorkoutPayload, buildUpdateWorkoutPayload } from "../utils";
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
    updateWorkout
  } = useProgramStoreActions();

  const [isSaving, setIsSaving] = useState(false);

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

  const submitNewWorkout = useCallback(async (raw: RawWorkoutData) => {
      const payload = buildNewWorkoutPayload(raw, week, day, 0);
      setIsSaving(true);

      try {
        await addWorkoutToProgram({
          programId,
          program_workout: payload,
        });
        toast.success("Workout added!");
      } catch (err) {
        console.error(err);
        toast.error("Error adding workout.");
      } finally {
        debugger;
        setIsSaving(false);
        setIsEditingWorkout(false);
      }
    },
    [programId, week, day, addWorkoutToProgram, setIsEditingWorkout]
  );

  const submitWorkoutEdits = useCallback(async (raw: RawWorkoutData) => {
    if (!raw.workoutId) return;
    const workoutId = raw.workoutId;
    const payload = buildUpdateWorkoutPayload(raw);
    setIsSaving(true);

    try {
      await updateWorkout({workoutId, programId, program_workout: payload});
      toast.success("Workout updated!");
    } catch (err) {
      console.error(err);
      toast.error("Error updating workout.");
    } finally {
      debugger;
      setIsSaving(false);
      setIsEditingWorkout(false);
    }
  }, [updateWorkout, setIsEditingWorkout]);

  return {
    isSaving,
    pasteCopied,
    submitNewWorkout,
    submitWorkoutEdits
  };
}
