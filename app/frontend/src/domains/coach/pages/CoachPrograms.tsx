import {
  Box,
  Dialog,
  DialogTitle,
  Input,
  InputAdornment,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useMemo, useState } from 'react';
import { CoachProgram } from '../types/models';
import { useCoachProgramActions } from '../hooks/useCoachProgramActions';
import { useCoachProgramData } from '../hooks/useCoachProgramData';
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import ProgramListItem from '../components/ProgramListItem';
import CreateOrEditProgramDialog from '../components/CreateOrEditProgramDialog';

const CoachPrograms = () => {
  const { programs, loading, error } = useCoachProgramData();
  const [filteredPrograms, setFilteredPrograms] = useState<
    CoachProgram[] | null
  >(null);
  const [searchString, setSearchString] = useState('');
  const [createProgramVisible, setCreateProgramVisible] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openError, setOpenError] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<CoachProgram | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const open = Boolean(anchorEl);

  const {
    addProgram,
    updateProgram,
    fetchPrograms,
    fetchProgramById,
    deleteProgram,
    resetError,
  } = useCoachProgramActions();

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (error) {
      setOpenError(true);
    }
  }, [error]);

  const handleOpenOptions = (
    event: React.MouseEvent<HTMLButtonElement>,
    program: CoachProgram,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedProgram(program);
  };

  const handleCloseOptions = () => {
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setCreateProgramVisible(false);
    setIsEditing(false);
    setSelectedProgram(null);
  };

  useEffect(() => {
    if (searchString.trim() === '') {
      setFilteredPrograms(null);
    } else {
      const lowerCaseSearch = searchString.toLowerCase();
      const filtered = sortedPrograms.filter((program) =>
        program.name?.toLowerCase().includes(lowerCaseSearch),
      );
      setFilteredPrograms(filtered);
    }
  }, [searchString]);

  const handleCreateProgram = async (
    programName: string,
    programDescription: string,
    programWeeks: string,
  ) => {
    if (programName !== '') {
      try {
        await addProgram({
          programName,
          programDescription,
          num_weeks: parseInt(programWeeks),
        });
      } catch (err) {
        console.error('Error adding program:', err);
      }
    }
  };

  const handleDeleteProgram = async () => {
    if (selectedProgram) {
      const id = selectedProgram.id;
      handleCloseOptions();
      setSelectedProgram(null);
      try {
        await deleteProgram(id);
      } catch (err) {
        console.error('Error deleting program:', err);
      }
    }
  };

  const handleStartEditProgram = async () => {
    if (selectedProgram) {
      setIsEditing(true);
      handleCloseOptions();
    }
  };

  const handleSubmitEditProgram = async (
    name: string,
    desc: string,
    weeks: string,
  ) => {
    if (selectedProgram) {
      try {
        await updateProgram({
          programId: selectedProgram.id,
          programName: name,
          programDescription: desc,
          num_weeks: parseInt(weeks),
        });
        setSelectedProgram(null);
      } catch (err) {
        console.error('Error editing program:', err);
      }
    }
  };

  const handleDuplicateProgram = async () => {
    const program = selectedProgram;
    handleCloseOptions();
    if (program) {
      try {
        await addProgram({
          programName: program.name,
          programDescription: program.description,
          num_weeks: program.num_weeks ?? 2,
        });
        setSelectedProgram(null);
      } catch (err) {
        console.error('Error duplicating program:', err);
      }
    }
  };

  const sortedPrograms = useMemo(() => {
    return programs
      .slice()
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [programs]);

  const programsToDisplay = filteredPrograms ?? sortedPrograms;

  return (
    <div
      id="programs-wrapper"
      className="flex min-h-screen flex-grow bg-gray-100 pl-[220px]"
    >
      <div
        id="programs-container"
        className="m-auto mt-15 mb-25 flex min-w-[1000px] flex-col items-center"
      >
        <Snackbar
          open={openError}
          autoHideDuration={4000}
          onClose={() => {
            setOpenError(false);
            resetError();
          }}
          message={error}
        />
        <div id="programs-header" className="flex w-full items-center">
          <p className="flex-grow text-2xl font-bold">Programs</p>
          <div>
            <button
              onClick={() => setCreateProgramVisible(true)}
              type="button"
              className="h-[45px] w-[170px] rounded-md bg-[#4e4eff] px-3 py-2 text-white"
            >
              + Create Program
            </button>
            <button
              type="button"
              style={{ cursor: 'pointer' }}
              className="ml-5 h-[45px] w-[170px] cursor-pointer rounded-md border bg-white px-3 py-2"
            >
              Manage Tags
            </button>
          </div>
        </div>
        <div
          id="programs-search"
          className="mt-15 flex w-full items-center justify-center"
        >
          <Input
            fullWidth
            disableUnderline
            placeholder="Search"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon
                  sx={(theme) => ({ color: theme.palette.grey[400] })}
                />
              </InputAdornment>
            }
            sx={{
              padding: '10px',
              border: '1px solid black',
              backgroundColor: 'white',
              height: '45px',
              flexGrow: 1,
            }}
          ></Input>
          <button
            type="button"
            className="ml-5 flex h-[45px] w-[170px] items-center justify-center rounded-md border bg-white px-3 py-2"
          >
            <TuneIcon sx={{ mr: '8px' }} />
            <span>Filters</span>
          </button>
        </div>
        <div className="programs-list-container mt-7 flex w-full flex-col">
          <div
            id="programs-list-header"
            className="flex h-12 w-full items-center rounded-tl-md rounded-tr-md bg-[#D8D8E0]"
          >
            <p className="mr-10 ml-5 text-[18px] font-bold">Weeks</p>
            <p className="text-[18px] font-bold">Name</p>
          </div>
          {programsToDisplay.map((program, index) => (
            <ProgramListItem
              key={program.id}
              index={index}
              program={program}
              open={open}
              openOptions={handleOpenOptions}
              closeOptions={handleCloseOptions}
              editProgram={handleStartEditProgram}
              deleteProgram={handleDeleteProgram}
              duplicateProgram={handleDuplicateProgram}
              anchorEl={anchorEl}
            />
          ))}
        </div>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseOptions}
          MenuListProps={{ 'aria-labelledby': 'basic-button' }}
        >
          <MenuItem onClick={() => handleStartEditProgram()}>
            Edit program
          </MenuItem>
          <MenuItem onClick={() => handleDeleteProgram()} sx={{ color: 'red' }}>
            Delete program
          </MenuItem>
          <MenuItem onClick={() => handleDuplicateProgram()}>
            Duplicate program
          </MenuItem>
        </Menu>
      </div>
      <CreateOrEditProgramDialog
        open={createProgramVisible || isEditing}
        closeDialog={handleCloseDialog}
        submitProgram={(name, desc, weeks) => {
          if (selectedProgram) {
            handleSubmitEditProgram(name, desc, weeks);
          } else {
            handleCreateProgram(name, desc, weeks);
          }
        }}
        initialValues={
          isEditing && selectedProgram
            ? {
                programName: selectedProgram.name,
                programDescription: selectedProgram.description,
                programWeeks: selectedProgram.num_weeks.toString(),
              }
            : undefined
        }
      />
    </div>
  );
};

export default CoachPrograms;
