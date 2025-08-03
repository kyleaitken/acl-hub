import { Tooltip } from "@mui/material";
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface ProgramDayHeaderProps {
  label: string;
  isFirstDay: boolean;
  week: number;
  showPasteWorkouts: boolean;
  onPasteWorkouts: () => void;
  onAddWorkout: () => void;
}

const ProgramDayHeader = ({label, isFirstDay, week, showPasteWorkouts, onPasteWorkouts, onAddWorkout}: ProgramDayHeaderProps) => {
  return (
    <div className="text-md bg-[#d0ccdb] font-semibold px-2 py-1 flex items-center justify-between">
      <span>{isFirstDay && `Week ${week} `}</span>
      <div className="flex items-center justify-center">
        {showPasteWorkouts &&
        <Tooltip title="Paste workout(s)" placement="top">
          <button 
            aria-label="Paste workouts"
            type="button"
            className="cursor-pointer pb-0.5 mr-2"
            onClick={onPasteWorkouts}
          >
            <ContentPasteIcon 
              sx={{
                fontSize: '18px',
                "&:hover": {
                  color: "#757575" 
                }
              }}
            />
          </button>
        </Tooltip>
        }
        <Tooltip title="Add workout" placement="top">
          <button 
            aria-label="Add workout"
            type="button"
            className="cursor-pointer pb-0.5 mr-2"
            onClick={onAddWorkout}
          >
            <AddCircleIcon 
              sx={{
                fontSize: '20px',
                "&:hover": {
                  color: "#757575" 
                }
              }}
            
            />
          </button>
        </Tooltip>
        <span>{label}</span>
      </div>
    </div>
  )
};

export default ProgramDayHeader;