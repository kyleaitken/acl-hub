import { Program } from '../types/models';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SendIcon from '@mui/icons-material/Send';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import React from 'react';
import TooltipIconButton from '../../core/components/TooltipIconButton';

interface ProgramListItemProps {
  program: Program;
  open: boolean;
  openOptions: (
    e: React.MouseEvent<HTMLButtonElement>,
    program: Program,
  ) => void;
  handleAddTagsToProgram: (program: Program) => void;
  handleRemoveTagFromProgram: (programId: number, tagId: number) => void;
  handleNavigateToProgram: (programId: number) => void;
}

const ProgramListItem = ({
  program,
  open,
  openOptions,
  handleAddTagsToProgram,
  handleRemoveTagFromProgram,
  handleNavigateToProgram
}: ProgramListItemProps) => {

  const hasTags = program.tags.length > 0;
  
  return (
    <div className='flex flex-col border-2 border-gray-300 bg-white'>
      <div className="flex pt-3 pb-5 pl-5">
        <div id={`program-${program.id}-calendar`} className="relative mt-1 mr-15 inline-flex items-center">
          <CalendarTodayIcon sx={{ fontSize: 30, color: 'gray' }} />
          <div className="text-sm absolute inset-0 mt-1.5 flex items-center justify-center font-semibold">
            {program.num_weeks}
          </div>
        </div>
        <div
          onClick={() => handleNavigateToProgram(program.id)} 
          id={`program-${program.id}-name`} 
          className="mt-3 flex flex-grow flex-col items-startv cursor-pointer"
        >
          <p className='font-semibold text-[14px]'>{program.name}</p>
          <p className="mt-1 max-w-[95%] text-xs">{program.description || ''}</p>
        </div>
        <div className="mr-12 flex items-center">
          <button
            type="button"
            className="ml-5 flex items-center justify-center rounded-md border bg-white px-3 py-2 cursor-pointer text-sm h-8 hover:bg-gray-200"
          >
            <SendIcon sx={{ fontSize: 15, mr: '5px' }} />
            <span className='text-xs'>Assign To Client</span>
          </button>
          <button
            id="basic-button"
            aria-label="More options"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={(e) => openOptions(e, program)}
            type="button"
            className="ml-2 flex h-8 w-[45px] justify-center rounded-md border bg-white cursor-pointer hover:bg-gray-200"
          >
            <span className="text-lg">•••</span>
          </button>
        </div>
      </div>
      <div className="tags-buttons-container ml-24 flex flex-wrap items-center gap-2 pb-4 pr-5 pl-3 w-[800px]">
        <button
          type="button"
          className='text-xs rounded-lg px-2 py-1 cursor-pointer mr-5 h-7 bg-[var(--blue-button)] text-white hover:bg-blue-800'
          onClick={() => handleAddTagsToProgram(program)}
        >
          <span className='flex justify-center'>
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
              <TooltipIconButton
                tooltipContent='Remove tag'
                buttonClassName='cursor-pointer'
                aria-label='Remove tag from program'
                onClick={() => handleRemoveTagFromProgram(program.id, tag.id)}  
              >
                <HighlightOffIcon sx={{fontSize: '20px', ml: 1, color: "#e72525"}}/> 
              </TooltipIconButton>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default React.memo(ProgramListItem);
