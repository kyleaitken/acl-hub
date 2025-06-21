import { CoachProgram } from '../types/models';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SendIcon from '@mui/icons-material/Send';
import { Menu, MenuItem } from '@mui/material';
import React from 'react';

interface ProgramListItemProps {
  program: CoachProgram;
  open: boolean;
  openOptions: (e: React.MouseEvent<HTMLButtonElement>, index: number) => void;
  closeOptions: () => void;
  editProgram: (id: number) => void;
  deleteProgram: () => void;
  duplicateProgram: () => void;
  anchorEl: HTMLElement | null;
}

const ProgramListItem = ({
  program,
  open,
  anchorEl,
  openOptions,
  closeOptions,
  editProgram,
  deleteProgram,
  duplicateProgram,
}: ProgramListItemProps) => {
  return (
    <div
      style={{
        display: 'flex',
        paddingLeft: '20px',
        paddingBottom: '15px',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingTop: '10px',
        border: '2px solid lightgray',
      }}
      key={program.id}
    >
      <div className="relative mt-3 mr-15 inline-flex items-center">
        <CalendarTodayIcon sx={{ fontSize: 40, color: 'gray' }} />
        <div className="absolute inset-0 mt-2 flex items-center justify-center font-bold">
          {program.num_weeks}
        </div>
      </div>
      <div className="mt-3 flex flex-grow flex-col">
        <p>{program.name}</p>
        <p className="mt-1 max-w-[95%] text-sm">{program.description || ''}</p>
      </div>
      <div className="mr-8 flex min-w-[280px] items-center">
        <button
          type="button"
          className="ml-5 flex h-[45px] w-[170px] items-center justify-center rounded-md border bg-white px-3 py-2"
        >
          <SendIcon sx={{ fontSize: '20px', mr: '5px' }} />
          <span>Assign To Client</span>
        </button>
        <button
          id="basic-button"
          aria-label="More options"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={(e) => openOptions(e, program.id)}
          type="button"
          className="ml-5 flex h-[30px] w-[45px] justify-center rounded-md border bg-white"
        >
          <span className="text-l">•••</span>
        </button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={closeOptions}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={() => editProgram(program.id)}>
            Edit program
          </MenuItem>
          <MenuItem onClick={deleteProgram} sx={{ color: 'red' }}>
            Delete program
          </MenuItem>
          <MenuItem onClick={duplicateProgram}>Duplicate program</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default ProgramListItem;
