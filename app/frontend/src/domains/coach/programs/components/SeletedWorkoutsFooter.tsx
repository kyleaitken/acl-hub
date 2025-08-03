import PeopleIcon from '@mui/icons-material/People';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { Checkbox, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useProgramActions } from '../hooks/useProgramStoreActions';
import TooltipIconButton from '../../core/components/TooltipIconButton';

interface SelectedWorkoutsProps {
  selectedWorkoutIds: number[];
  handleDeleteWorkoutsClicked: () => void;
  handleSelectAllClicked: () => void;
}

const tooltipSlotProps = {
  tooltip: {
    sx: {fontSize: '1em', backgroundColor: '#2e2c2c'}
  },
  popper: {
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, -10],
        },
      },
    ],
  },
}

const SelectedWorkoutsFooter = ({
  selectedWorkoutIds, 
  handleDeleteWorkoutsClicked, 
  handleSelectAllClicked}: SelectedWorkoutsProps) => {

  const [selectAllSelected, setSelectAllSelected] = useState(false);
  const { setSelectedWorkoutIds, setCopiedWorkoutIds } = useProgramActions();
  
  const handleToggleSelect = () => {
    if (!selectAllSelected) {
      setSelectAllSelected(true);
      handleSelectAllClicked();
    }
  }

  const numSelected = selectedWorkoutIds.length;
    
  return (
    <div id="selected-workouts-footer" className="bottom-0 border-t-1 flex items-center sticky w-full z-100 h-[80px] p-5 bg-white">
      <div id="left-footer-section" className="flex items-center flex-1">
        <Tooltip title="Select all"
          slotProps={tooltipSlotProps}
        >
          <Checkbox 
            value={selectAllSelected}
            disableFocusRipple 
            disableTouchRipple 
            disabled={selectAllSelected}
            size="large" 
            id="select-all-workouts-checkbox"
            onChange={() => handleToggleSelect()}
          />
        </Tooltip>
        <div className="ml-5">
          <span className="bg-blue-400 text-white py-1 px-3 rounded-lg mr-2 font-bold">{numSelected}</span>
          <span className="font-semibold text-md">WORKOUTS SELECTED</span>
        </div>
        <button 
          className="hover:underline cursor-pointer text-sm text-blue-800 ml-5"
          onClick={() => setSelectedWorkoutIds([])}
        >
          Clear Selection
        </button>
      </div>
      <div id="middle-footer-buttons" className="flex items-center flex-1 justify-center">
        {numSelected === 1 &&
        <TooltipIconButton 
          title="Assign workout"
          onClick={() => console.log("assign workout clicked")}
          aria-label="Assign workout"
          buttonClassName={"cursor-pointer mr-3"}
          tooltipPosition="top"
        >
          <PeopleIcon sx={{fontSize: '28px'}}/>
        </TooltipIconButton>
        }

        <TooltipIconButton 
          title="Copy workouts"
          onClick={() => {
            setCopiedWorkoutIds(selectedWorkoutIds)
            setSelectedWorkoutIds([]);
          }}
          aria-label="Copy workouts"
          buttonClassName={"cursor-pointer mx-3"}
          tooltipPosition="top"
        >
          <ContentCopyIcon sx={{fontSize: '28px'}}/>
        </TooltipIconButton>
      
        <TooltipIconButton 
          title="Delete workouts"
          onClick={handleDeleteWorkoutsClicked}
          aria-label="Delete workouts"
          buttonClassName={"cursor-pointer ml-3"}
          tooltipPosition="top"
        >
          <DeleteIcon sx={{color: 'red', fontSize: '28px'}}/>
        </TooltipIconButton>
      </div>
      <div className="flex-grow"></div>
    </div>
  )
};

export default SelectedWorkoutsFooter;