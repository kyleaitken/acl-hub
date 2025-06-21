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
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SendIcon from '@mui/icons-material/Send';
import React from 'react';
import Snackbar from '@mui/material/Snackbar';

const CoachPrograms = () => {
  const { programs, loading, error } = useCoachProgramData();
  const [filteredPrograms, setFilteredPrograms] = useState<
    CoachProgram[] | null
  >(null);
  const [searchString, setSearchString] = useState('');
  const [createProgramVisible, setCreateProgramVisible] = useState(false);
  const [editProgramId, setEditProgramId] = useState<number | null>(null);
  const [editProgramName, setEditProgramName] = useState('');
  const [editProgramDescription, setEditProgramDescription] = useState('');
  const [programName, setProgramName] = useState('');
  const [programDescription, setProgramDescription] = useState('');
  const [programWeeks, setProgramWeeks] = useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [optionsOpenIndex, setOptionsOpenIndex] = useState<number>(-1);
  const [openError, setOpenError] = useState(false);
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
    index: number,
  ) => {
    setOptionsOpenIndex(index);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseOptions = () => {
    setAnchorEl(null);
    setOptionsOpenIndex(-1);
  };

  const handleCloseDialog = () => {
    setCreateProgramVisible(false);
    setEditProgramId(null);
    setEditProgramName('');
    setEditProgramDescription('');
    setProgramName('');
    setProgramWeeks('');
    setProgramDescription('');
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

  const handleCreateProgram = async () => {
    if (programName !== '') {
      try {
        await addProgram({
          programName,
          programDescription,
          num_weeks: parseInt(programWeeks),
        });
      } catch (err) {
        console.error('Error adding program:', err);
      } finally {
        handleCloseDialog();
      }
    }
  };

  const handleDeleteProgram = async () => {
    const index = optionsOpenIndex;
    const id = sortedPrograms[index].id;
    handleCloseOptions();
    try {
      await deleteProgram(id);
    } catch (err) {
      console.error('Error deleting program:', err);
    }
  };

  const handleStartEditProgram = async (programId: number) => {
    const index = optionsOpenIndex;
    handleCloseOptions();
    setEditProgramName(sortedPrograms[index].name);
    setEditProgramDescription(sortedPrograms[index].description || '');
    setEditProgramId(programId);
  };

  const handleSubmitEditProgram = async () => {
    if (editProgramId) {
      try {
        updateProgram({
          programId: editProgramId,
          programName: editProgramName,
          programDescription: editProgramDescription,
        });
        // handleCloseDialog();
      } catch (err) {
        console.error('Error editing program:', err);
      } finally {
        handleCloseDialog();
      }
    }
  };

  const handleDuplicateProgram = async () => {
    const program = sortedPrograms[optionsOpenIndex];
    handleCloseOptions();
    try {
      await addProgram({
        programName: program.name,
        programDescription: program.description,
        num_weeks: program.num_weeks ?? 2,
      });
    } catch (err) {
      console.error('Error duplicating program:', err);
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
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  mt: '10px',
                  mr: '60px',
                }}
              >
                <CalendarTodayIcon sx={{ fontSize: 40, color: 'gray' }} />
                <Box
                  sx={{
                    mt: '8px',
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: 'black',
                  }}
                >
                  {program.num_weeks}
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  mt: '10px',
                  flexGrow: 1,
                }}
              >
                <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
                  {program.name}
                </Typography>
                <Typography
                  sx={{ fontSize: '15px', mt: '5px', maxWidth: '95%' }}
                >
                  {program.description || ''}
                </Typography>
              </Box>
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
                  onClick={(e) => handleOpenOptions(e, index)}
                  type="button"
                  className="ml-5 flex h-[30px] w-[45px] justify-center rounded-md border bg-white"
                >
                  <span className="text-l">•••</span>
                </button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleCloseOptions}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={() => handleStartEditProgram(program.id)}>
                    Edit program
                  </MenuItem>
                  <MenuItem onClick={handleDeleteProgram} sx={{ color: 'red' }}>
                    Delete program
                  </MenuItem>
                  <MenuItem onClick={handleDuplicateProgram}>
                    Duplicate program
                  </MenuItem>
                </Menu>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Dialog open={createProgramVisible} fullWidth onClose={handleCloseDialog}>
        <DialogTitle sx={{ fontWeight: 600, fontSize: '22px' }}>
          Create new program
        </DialogTitle>
        <form
          style={{ paddingBottom: '30px', paddingLeft: '24px' }}
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateProgram();
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
            Program Name
          </Typography>
          <Input
            placeholder="Enter a name"
            disableUnderline
            onChange={(e) => setProgramName(e.target.value)}
            value={programName}
            sx={{
              mb: '20px',
              padding: '5px 5px 5px 10px',
              border: '1px solid black',
              backgroundColor: 'white',
              minHeight: '45px',
              width: '90%',
            }}
          />
          <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
            {'Program Length (Weeks)'}
          </Typography>
          <Input
            placeholder="Enter the number of weeks"
            disableUnderline
            type="number"
            onChange={(e) => setProgramWeeks(e.target.value)}
            value={programWeeks}
            sx={{
              mb: '20px',
              padding: '5px 5px 5px 10px',
              border: '1px solid black',
              backgroundColor: 'white',
              minHeight: '45px',
              width: '90%',
            }}
          />
          <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
            Program Description (Optional)
          </Typography>
          <Input
            disableUnderline
            placeholder="Enter a description"
            multiline
            onChange={(e) => setProgramDescription(e.target.value)}
            value={programDescription}
            sx={{
              padding: '5px 5px 5px 10px',
              border: '1px solid black',
              backgroundColor: 'white',
              minHeight: '45px',
              width: '90%',
            }}
          />
          <Box sx={{ mt: '20px' }}>
            <button
              type="button"
              className="mr-5 h-[40px] w-[150px] rounded-md border bg-[#4e4eff] px-3 py-2 text-white"
              onClick={handleCreateProgram}
            >
              Save Program
            </button>
            <button
              onClick={handleCloseDialog}
              type="button"
              className="mr-10 h-[40px] w-[110px] rounded-md border bg-red-500 px-3 py-2 text-white"
            >
              Cancel
            </button>
          </Box>
        </form>
      </Dialog>
      <Dialog
        open={editProgramId !== null}
        fullWidth
        onClose={() => setEditProgramId(null)}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '22px' }}>
          Edit program
        </DialogTitle>
        <form
          style={{ paddingBottom: '30px', paddingLeft: '24px' }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitEditProgram();
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
            Program Name
          </Typography>
          <Input
            value={editProgramName}
            disableUnderline
            onChange={(e) => setEditProgramName(e.target.value)}
            sx={{
              mb: '20px',
              padding: '5px 5px 5px 10px',
              border: '1px solid black',
              backgroundColor: 'white',
              minHeight: '45px',
              width: '90%',
            }}
          />
          <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
            Program Description (Optional)
          </Typography>
          <Input
            disableUnderline
            placeholder={
              editProgramDescription
                ? editProgramDescription
                : 'Enter a description'
            }
            value={editProgramDescription}
            multiline
            onChange={(e) => setEditProgramDescription(e.target.value)}
            sx={{
              padding: '5px 5px 5px 10px',
              border: '1px solid black',
              backgroundColor: 'white',
              minHeight: '45px',
              width: '90%',
            }}
          />
          <Box sx={{ mt: '20px' }}>
            <button
              onClick={handleSubmitEditProgram}
              className="mr-5 h-[40px] w-[150px] cursor-pointer rounded-md border bg-[#4e4eff] px-3 py-2 text-white"
              type="button"
            >
              Update program
            </button>
            <button
              onClick={handleCloseDialog}
              className="mr-10 h-[40px] w-[110px] cursor-pointer rounded-md border bg-red-500 px-3 py-2 text-white"
              type="button"
            >
              Cancel
            </button>
          </Box>
        </form>
      </Dialog>
    </div>
  );
};

export default CoachPrograms;
