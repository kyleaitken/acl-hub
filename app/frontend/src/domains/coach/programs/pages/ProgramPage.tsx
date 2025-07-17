import WestIcon from '@mui/icons-material/West';
import { useNavigate } from "react-router-dom";
import { useProgramActions } from "../hooks/useProgramActions";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useProgramDetails } from '../hooks/useProgramData';
import ProgramSkeleton from '../components/ProgramSkeleton';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import { ProgramWorkout } from '../types';
import ProgramWeek from '../components/ProgramWeek';
import { useDragStore } from '../../core/store/dragStore';
import toast from 'react-hot-toast';

const ProgramPage = () => {
  const navigate = useNavigate();
  const { fetchProgram, updateWorkoutPositions } = useProgramActions();
  const { programId } = useParams();
  const id = Number(programId);
  const { draggedWorkout, dropTarget, setDraggedWorkout, setDropTarget } = useDragStore();
  const { program } = useProgramDetails(id);

  useEffect(() => {
    fetchProgram(id);
  }, []);

  const workoutsByWeek = useMemo(() => {
    const grouped: Record<number, ProgramWorkout[]> = {};
    if (!program?.program_workouts) return grouped;
  
    for (const workout of program.program_workouts) {
      if (!grouped[workout.week]) grouped[workout.week] = [];
      grouped[workout.week].push(workout);
    }
    return grouped;
  }, [program?.program_workouts]);

  const handleDropToDay = async (targetWeek: number, targetDay: number) => {    
    if (!draggedWorkout || !program || !dropTarget) return;
  
    const { workout: dragged, from } = draggedWorkout;
    let updated = program.program_workouts.filter(w => w.id !== dragged.id);

    // build the target-day stack (sorted)
    const targetStack = updated
      .filter(w => w.week === targetWeek && w.day === targetDay)
      .sort((a, b) => a.order - b.order);

    let newStack;
    // same-day reorder?
    if (from.week === targetWeek && from.day === targetDay) {
      // splice into the recorded drop index
      const arr = [...targetStack];
      arr.splice(dropTarget.index, 0, { ...dragged, week: targetWeek, day: targetDay });
      newStack = arr;
    } else {
      // cross-day move: append
        newStack = [...targetStack, { ...dragged, week: targetWeek, day: targetDay }];
    }

    // reassign order sequentially
    const reordered = newStack.map((w, i) => ({ ...w, order: i }));

    // merge back into full list
    updated = [
      ...updated.filter(w => !(w.week === targetWeek && w.day === targetDay)),
      ...reordered,
    ];
  
    try {
      await updateWorkoutPositions({
        programId: program.id,
        workouts_positions: updated.map(({ id, week, day, order }) => ({ id, week, day, order })),
      });
      setDraggedWorkout(null);
      setDropTarget(null);
      toast.success("Workout moved");
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to move workout");
    }
  };

  return (
    /*
      - Workout
        - can copy workout and paste into another day
        - can click workout, which opens footer with options to delete, copy, cut
        - workouts have a title, warmup, list of exercises, cooldown
        - if you click on a workout, it expands to being a form where you can edit the sections
        - can add demo videos 
        - save/cancel on the form changes
        - non expanded workout shows a truncated warmup/cooldown, but shows all exercise description/instructions - doesn't show the extra buttons naturally
    */ 
    <div className="p-5 bg-gray-100 h-screen overflow-y-auto">
      <button className="cursor-pointer hover:underline text-blue-600"
        onClick={() => navigate("/coach/programs")}
      >
        <WestIcon sx={{fontSize: '18px', mr: 1.5}}/>
        <span className="text-sm">Back to Programs</span>
      </button>
      {!program ? <ProgramSkeleton /> :
      <div id="program-box" className="flex flex-col w-full bg-white mt-10 py-10 px-8 rounded-md">
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
        <p className='font-semibold text-xl mb-2'>Workouts</p>

        {Object.entries(workoutsByWeek).map(([week, workouts], index, arr) => {
          return (
            <ProgramWeek
              key={week}
              week={Number(week)}
              workouts={workouts}
              isLastWeek={index === arr.length - 1}
              onDropToDay={handleDropToDay}
            />
          )
        })}

      </div>
      }
    </div>
  )
};

export default ProgramPage;