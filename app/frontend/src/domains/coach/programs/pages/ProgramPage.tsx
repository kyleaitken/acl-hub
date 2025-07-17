// src/pages/ProgramPage.tsx
import { useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import WestIcon from "@mui/icons-material/West";
import { useNavigate, useParams } from "react-router-dom";
import { useProgramActions } from "../hooks/useProgramActions";
import { useProgramDetails } from "../hooks/useProgramData";
import ProgramSkeleton from "../components/ProgramSkeleton";
import ProgramWeek from "../components/ProgramWeek";
import toast from "react-hot-toast";
import { ProgramWorkout } from "../types";

const ProgramPage = () => {
  const navigate = useNavigate();
  const { programId } = useParams<{ programId: string }>();
  const id = Number(programId);
  const { fetchProgram, updateWorkoutPositions } = useProgramActions();
  const { program } = useProgramDetails(id);

  const [localWorkouts, setLocalWorkouts] = useState<ProgramWorkout[]>([]);

  useEffect(() => {
    fetchProgram(id);
  }, [id]);

  useEffect(() => {
    if (program?.program_workouts) {
      setLocalWorkouts(program.program_workouts);
    }
  }, [program?.program_workouts]);

  // splice the dragged workout into a new position for preview
  const moveWorkout = (
    workoutId: number,
    toWeek: number,
    toDay: number,
    toIndex: number
  ) => {
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

  const handleDrop = async () => {
    if (!program) return;
    try {
      await updateWorkoutPositions({
        programId: program.id,
        workouts_positions: localWorkouts.map(({ id, week, day, order }) => ({
          id,
          week,
          day,
          order,
        })),
      });
      toast.success("Workouts updated");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  const workoutsByWeek = useMemo(
    () =>
      localWorkouts.reduce<Record<number, ProgramWorkout[]>>((acc, workout) => {
        (acc[workout.week] ||= []).push(workout);
        return acc;
      }, {}),
    [localWorkouts]
  );

  if (!program) return <ProgramSkeleton />;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-5 bg-gray-100 h-screen overflow-y-auto">
        <button
          className="cursor-pointer hover:underline text-blue-600"
          onClick={() => navigate("/coach/programs")}
        >
          <WestIcon sx={{ fontSize: "18px", mr: 1.5 }} />
          <span className="text-sm">Back to Programs</span>
        </button>
        <div
          id="program-box"
          className="flex flex-col w-full bg-white mt-10 py-10 px-8 rounded-md"
        >
          {/* header omitted for brevity */}
          <p className="font-semibold text-xl mb-2">Workouts</p>
          {Object.entries(workoutsByWeek).map(
            ([weekNum, workouts], idx, arr) => (
              <ProgramWeek
                key={weekNum}
                week={Number(weekNum)}
                workouts={workouts}
                isLastWeek={idx === arr.length - 1}
                moveWorkout={moveWorkout}
                onDrop={handleDrop}
              />
            )
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default ProgramPage;
