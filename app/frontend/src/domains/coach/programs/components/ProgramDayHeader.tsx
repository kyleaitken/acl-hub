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
    <div className="text-md bg-[#d0ccdb] font-semibold px-2 py-1 flex items-center justify-between min-h-9">
      {isFirstDay &&
      <div className='flex items-center'>
        {!isEditingWorkout &&
        <ConfirmDeleteButton 
          onDeleteConfirmed={() => onDeleteWeek()}
          tooltipText='Delete week'
          confirmText='Delete this week and its workouts?'
          iconSize={20}
          iconColor='black'
          buttonClassName='p-0 mr-2 pb-1'
        />
        }
        <span>{isFirstDay && `Week ${week} `}</span>
      </div>
      }
      <div className="flex items-center justify-center">
        {showPasteWorkouts &&
          <TooltipIconButton 
            title="Paste workout(s)"
            onClick={onPasteWorkouts}
            aria-label="Paste workouts to program"
            buttonClassName={"cursor-pointer pb-0.5 mr-2 disabled:opacity-50 disabled:cursor-not-allowed"}
            placementOffset={[0, -75]}
          >
            <ContentPasteIcon 
              sx={{
                fontSize: '18px',
                "&:hover": {
                  color: "#757575" 
                }
              }}
            />
          </TooltipIconButton>
        } 
        <TooltipIconButton 
          title="Add workout"
          onClick={onAddWorkout}
          aria-label="Add workout to program"
          buttonClassName={"cursor-pointer pb-0.5 mr-2 disabled:opacity-50 disabled:cursor-not-allowed"}
          disabled={isEditingWorkout}
          placementOffset={[0, -75]}
        >
          <AddCircleIcon 
            sx={{
              fontSize: '20px',
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