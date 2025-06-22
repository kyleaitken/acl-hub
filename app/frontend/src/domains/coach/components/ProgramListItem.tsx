import { CoachProgram } from '../types/models';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SendIcon from '@mui/icons-material/Send';
import React from 'react';

interface ProgramListItemProps {
  program: CoachProgram;
  open: boolean;
  openOptions: (
    e: React.MouseEvent<HTMLButtonElement>,
    program: CoachProgram,
  ) => void;
}

const ProgramListItem = ({
  program,
  open,
  openOptions,
}: ProgramListItemProps) => {
  return (
    <div className="flex items-center border-2 border-gray-300 bg-white pt-3 pb-4 pl-5">
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
          onClick={(e) => openOptions(e, program)}
          type="button"
          className="ml-5 flex h-[30px] w-[45px] justify-center rounded-md border bg-white"
        >
          <span className="text-lg">•••</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(ProgramListItem);
