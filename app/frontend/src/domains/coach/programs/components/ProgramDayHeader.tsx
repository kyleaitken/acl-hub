import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useProgramData } from "../hooks/useProgramStoreData";
import TooltipIconButton from "../../core/components/TooltipIconButton";
import { ConfirmDeleteButton } from '../../core/components/ConfirmDeleteButton';

interface ProgramDayHeaderProps {
  label: string;
  isFirstDay: boolean;
  week: number;
  showPasteWorkouts: boolean;
  onPasteWorkouts: () => void;
  onAddWorkout: () => void;
  onDeleteWeek: () => void;
}

const ProgramDayHeader = ({label, isFirstDay, week, onPasteWorkouts, showPasteWorkouts, onAddWorkout, onDeleteWeek}: ProgramDayHeaderProps) => {
  const { isEditingWorkout } = useProgramData();

  return (
    <div className="text-[12px] bg-[#d0ccdb] font-semibold px-2 py-1 flex items-center justify-between min-h-9">
      {isFirstDay ?
      <div className='flex items-center'>
        {!isEditingWorkout &&
        <ConfirmDeleteButton 
          onDeleteConfirmed={() => onDeleteWeek()}
          tooltipText='Delete week'
          confirmText='Delete this week and its workouts?'
          iconSize={17}
          iconColor='black'
          buttonClassName='p-0 mr-1 pb-1'
          dialogClassName='-left-10 font-normal'
        />
        }
        <span>{isFirstDay && `Week ${week} `}</span>
      </div>
      : <div></div>
      }
      <div className="flex items-center justify-center">
        {showPasteWorkouts &&
          <TooltipIconButton 
            tooltipContent="Paste workout(s)"
            onClick={onPasteWorkouts}
            aria-label="Paste workouts to program"
            buttonClassName={"cursor-pointer pb-0.5 mr-2 disabled:opacity-50 disabled:cursor-not-allowed"}
            placementOffset={5}
          >
            <ContentPasteIcon 
              sx={{
                fontSize: 16,
                "&:hover": {
                  color: "#757575" 
                }
              }}
            />
          </TooltipIconButton>
        } 
        <TooltipIconButton 
          tooltipContent="Add workout"
          onClick={onAddWorkout}
          aria-label="Add workout to program"
          buttonClassName={"cursor-pointer pb-0.5 mr-2 disabled:opacity-50 disabled:cursor-not-allowed"}
          disabled={isEditingWorkout}
          placementOffset={5}
        >
          <AddCircleIcon 
            sx={{
              fontSize: 16,
              "&:hover": {
                color: "#757575" 
              }
            }}
          />
        </TooltipIconButton>

        <span>{label}</span>
      </div>
    </div>
  )
};

export default ProgramDayHeader;