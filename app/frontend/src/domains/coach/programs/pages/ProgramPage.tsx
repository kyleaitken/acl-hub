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

const ProgramPage = () => {
  
  const navigate = useNavigate();
  const { fetchProgram } = useProgramActions();
  const { programId } = useParams();
  const id = Number(programId);

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

  return (
    /*
      ProgramBox:
      - Grid of Weeks
        - Each week has 7 columns that are a day
      - Day
        - contains a stack of workouts
        - can drag workout components to other days
      - Workout
        - can drag workout
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
            />
          )
        })}

      </div>
      }
    </div>
  )
};

export default ProgramPage;