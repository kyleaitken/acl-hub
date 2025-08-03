import { useEffect, useMemo, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import WestIcon from "@mui/icons-material/West";
import { useNavigate, useParams } from "react-router-dom";
import { useProgramActions } from "../hooks/useProgramStoreActions";
import { useProgramData, useProgramDetails } from "../hooks/useProgramStoreData";
import ProgramSkeleton from "../components/ProgramSkeleton";
import ProgramWeek from "../components/ProgramWeek";
import toast from "react-hot-toast";
import { ProgramWorkout } from "../types";
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import SelectedWorkoutsFooter from "../components/SeletedWorkoutsFooter";
import { useShiftRangeSelect } from "../../core/hooks/useShiftRangeSelect";

const ProgramPage = () => {
  const [localWorkouts, setLocalWorkouts] = useState<ProgramWorkout[]>([]);
  const pasteTarget = useRef<{ week: number; day: number } | null>(null)

  const navigate = useNavigate();
  const { programId } = useParams<{ programId: string }>();
  const id = Number(programId);
  const { fetchProgram, 
          updateWorkoutPositions, 
          setSelectedWorkoutIds, 
          deleteWorkoutsFromProgram, 
          bulkCopyWorkoutsToProgram,
          updateProgramDetails
  } = useProgramActions();
  const { copiedWorkoutIds, selectedWorkoutIds } = useProgramData();
  const { program } = useProgramDetails(id);

  useEffect(() => {
    fetchProgram(id);
    return(() => {
      setSelectedWorkoutIds([]);
    })
  }, [id]);

  useEffect(() => {
    if (copiedWorkoutIds.length > 0) {
      toast.success(`${copiedWorkoutIds.length > 1 ? "Workouts" : "Worout"} copied!`);
    }
  }, [copiedWorkoutIds]);

  const handleDeleteSelectedWorkouts = () => {
    const len = selectedWorkoutIds.length;
    if (len === 0) return;

    try {
      deleteWorkoutsFromProgram(program.id, selectedWorkoutIds);
      toast.success(`${len} workout${len > 1 ? "s" : ""} deleted!`);
    } catch (err) {
      console.error("Error while deleting workouts: ", err);
      toast.error("Error occurred while deleting workouts.")
    } finally {
      setSelectedWorkoutIds([]);
    }
  };

  useEffect(() => {
    if (program?.program_workouts) {
      setLocalWorkouts(program.program_workouts);
    }
  }, [program?.program_workouts]);

  const handleSelectAllWorkouts = () => {
    const allIds = program.program_workouts.map((w) => w.id);
    setSelectedWorkoutIds(allIds);
  };

  const handleShiftSelect = useShiftRangeSelect<ProgramWorkout, number>({
    items: program?.program_workouts,
    selectedIds: selectedWorkoutIds,
    onChange: setSelectedWorkoutIds,
    getId: (w) => w.id,
    getPosition: (w) => (w.week - 1) * 7 + w.day,
  });

  // listener for pasting workouts 
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      if (!copiedWorkoutIds.length || !pasteTarget.current) return
      e.preventDefault()
      const { week, day } = pasteTarget.current
      bulkCopyWorkoutsToProgram({ programId: id, workoutIds: copiedWorkoutIds, targetWeek: week, targetDay: day })
        .then(() => toast.success("Workouts pasted"))
        .catch(() => toast.error("Paste failed"))
    }
    document.addEventListener('paste', onPaste)
    return () => document.removeEventListener('paste', onPaste)
  }, [copiedWorkoutIds, programId, bulkCopyWorkoutsToProgram])

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

  const handleDayHover = (week:number, day:number) => {
    pasteTarget.current = { week, day }
  }
  
  const workoutsByWeek = useMemo(() => {
    const grouped: Record<number, ProgramWorkout[]> = {};
    for (const w of localWorkouts) {
      (grouped[w.week] ||= []).push(w);
    }
    return grouped;
  }, [localWorkouts]);

  const handleCopyLastWeek = async () => {
    const lastWeek = program.num_weeks;
    const weekWorkouts = workoutsByWeek[lastWeek] || [];
  
    if (weekWorkouts.length === 0) {
      return handleAddWeek()
    }
  
    // otherwise bulk‐copy those workouts into week+1
    const workoutIds = weekWorkouts.map((w) => w.id);
    const baseDay = weekWorkouts[0].day;
  
    try {
      await bulkCopyWorkoutsToProgram({
        programId: id,
        workoutIds,
        targetWeek: lastWeek + 1,
        targetDay: baseDay,
      });
      toast.success("Program updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy last week");
    }
  };

  const handleAddWeek = async () => {
    try {
      await updateProgramDetails({
        programId: id,
        num_weeks: program.num_weeks + 1,
      });
      toast.success("Week added!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add week");
    }
  };

  const handleDeleteLastWeek = async () => {
    try {
      await updateProgramDetails({programId: id, num_weeks: program.num_weeks - 1})
      toast.success("Week removed!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove week");
    }
  }

  if (!program) return <ProgramSkeleton />;

  return (
    <>
    <DndProvider backend={HTML5Backend}>
      <div className="p-5 pb-0 bg-gray-100 h-screen overflow-y-auto">
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
          <div className="flex" id="program-header">
            <div id="program-title-and-description" className="flex flex-col flex-grow">
              <div className='text-2xl font-semibold'>{program.name}</div>
              <div className='mt-4 text-md'>{program.description}</div>
            </div>
            <div id="top-program-buttons" className='flex flex-col'>
              <button className='border-1 py-1 px-2 h-[40px] rounded-md cursor-pointer flex items-center mb-2 hover:bg-gray-200'>
                <EditIcon sx={{fontSize: '18px', mr: 1}} />
                Edit Program
              </button>
              <button className='border-1 py-1 px-2 h-[40px] rounded-md cursor-pointer flex items-center bg-[#4e4eff] text-white hover:bg-blue-500'>
                <SendIcon sx={{ fontSize: '18px', mr: 1 }} />
                Assign to Client
              </button>
            </div>
          </div>
          <hr className="w-full border-t border-gray-400 my-4" />
          <p className="font-semibold text-xl mb-2">Workouts</p>
          {[...Array(program.num_weeks)].map((_, i) => {
            const weekNum = i + 1;
            const workouts = workoutsByWeek[weekNum] || [];
            return (
              <ProgramWeek
                key={weekNum}
                week={weekNum}
                workouts={workouts}
                isLastWeek={weekNum === program.num_weeks}
                moveWorkout={moveWorkout}
                onDrop={handleDrop}
                onDayHover={handleDayHover}
                onSelectWorkout={handleShiftSelect}
                deleteLastWeek={handleDeleteLastWeek}
              />
            );
          })}

          {selectedWorkoutIds.length > 0 &&
            <SelectedWorkoutsFooter 
              selectedWorkoutIds={selectedWorkoutIds}
              handleDeleteWorkoutsClicked={handleDeleteSelectedWorkouts}
              handleSelectAllClicked={handleSelectAllWorkouts}
            />
          }

          <div className="mt-10 ml-3 flex">
            <button
              onClick={handleAddWeek}
              className="border-1 rounded-md py-2 px-5 flex items-center cursor-pointer hover:bg-gray-100"
            >
              <AddIcon />
              <span className="px-2">Add Week</span>
            </button>
            <button
              onClick={handleCopyLastWeek}
              className="border-1 rounded-md py-2 px-5 flex items-center cursor-pointer hover:bg-gray-100 ml-5"
            >
              <AddIcon />
              <span className="px-2">Copy Last Week</span>
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
    </>
  );
};

export default ProgramPage;
