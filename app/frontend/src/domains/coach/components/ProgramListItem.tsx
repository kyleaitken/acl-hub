import { CoachProgram } from '../types/models';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SendIcon from '@mui/icons-material/Send';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import React from 'react';

interface ProgramListItemProps {
  program: CoachProgram;
  open: boolean;
  openOptions: (
    e: React.MouseEvent<HTMLButtonElement>,
    program: CoachProgram,
  ) => void;
  handleAddTagsToProgram: (program: CoachProgram) => void;
  handleRemoveTagFromProgram: (programId: number, tagId: number) => void;
}

const ProgramListItem = ({
  program,
  open,
  openOptions,
  handleAddTagsToProgram,
  handleRemoveTagFromProgram
}: ProgramListItemProps) => {

  const hasTags = program.tags.length > 0;
  
  return (
    <div className='flex flex-col border-2 border-gray-300 bg-white'>
      <div className="flex pt-3 pb-5 pl-5">
        <div id={`program-${program.id}-calendar`} className="relative mt-1 mr-15 inline-flex items-center">
          <CalendarTodayIcon sx={{ fontSize: 40, color: 'gray' }} />
          <div className="absolute inset-0 mt-2 flex items-center justify-center font-bold">
            {program.num_weeks}
          </div>
        </div>
        <div id={`program-${program.id}-name`} className="mt-3 flex flex-grow flex-col items-start">
          <p className='font-bold'>{program.name}</p>
          <p className="mt-1 max-w-[95%] text-sm">{program.description || ''}</p>
        </div>
        <div className="mr-12 flex items-center">
          <button
            type="button"
            className="ml-5 flex items-center justify-center rounded-md border bg-white px-3 py-2 cursor-pointer text-sm h-8"
          >
            <SendIcon sx={{ fontSize: '16px', mr: '5px' }} />
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
            className="ml-2 flex h-8 w-[45px] justify-center rounded-md border bg-white cursor-pointer"
          >
            <span className="text-lg">•••</span>
          </button>
        </div>
      </div>
      <div className="tags-buttons-container ml-24 flex flex-wrap items-center gap-2 pb-4 px-5 w-[800px]">
      <button
          type="button"
          className='text-xs rounded-lg px-2 py-1 cursor-pointer mr-5 h-7 bg-blue-500 text-white'
          onClick={() => handleAddTagsToProgram(program)}
        >
          <span className='flex justify-center'>
            <AddCircleOutlineIcon sx={{fontSize: '15px', mr: 1}}/>
            Add tags
          </span>
        </button>
        {hasTags && program.tags.map((tag) => {
          return (
            <div
              className="text-xs border rounded-lg px-2 py-1 h-7 flex items-center overflow-hidden"
              key={tag.id}
            >
            <span className="truncate max-w-[120px]">{tag.name}</span>
            <button 
                onClick={() => handleRemoveTagFromProgram(program.id, tag.id)}  
                type="button"
                className='cursor-pointer'
                aria-label="Remove tag from program"
              >
                <HighlightOffIcon sx={{fontSize: '20px', ml: 1, color: "#e72525"}}/> 
              </button>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default React.memo(ProgramListItem);
