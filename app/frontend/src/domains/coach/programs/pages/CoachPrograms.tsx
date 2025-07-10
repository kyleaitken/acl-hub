import { Input, InputAdornment, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CoachProgram } from '../../core/types/models';
import { useCoachProgramActions } from '../hooks/useCoachProgramActions';
import { useCoachProgramData } from '../hooks/useCoachProgramData';
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import ProgramListItem from '../components/ProgramListItem';
import CreateOrEditProgramDialog from '../components/CreateOrEditProgramDialog';
import TagManager from '../components/TagManager';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const CoachPrograms = () => {
  const { programs, error } = useCoachProgramData();
  const [filteredPrograms, setFilteredPrograms] = useState<CoachProgram[] | null>(null);
  const [searchString, setSearchString] = useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openError, setOpenError] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<CoachProgram | null>(
    null,
  );
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | null>(null);
  const [dialogSession, setDialogSession] = useState<{
    mode: 'edit' | 'create';
    program: CoachProgram | null;
  } | null>(null);
  const [tagManagerOpen, setTagManagerOpen] = useState(false);

  const isEditing = dialogSession?.mode === 'edit';
  const menuOpen = Boolean(anchorEl);

  const {
    addProgram,
    updateProgram,
    fetchPrograms,
    fetchProgramById,
    deleteProgram,
    resetError, 
    addTagToProgram,
    removeTagFromProgram
  } = useCoachProgramActions();

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (error) {
      setOpenError(true);
    }
  }, [error]);

  const handleOpenOptions = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, program: CoachProgram) => {
      setAnchorEl(event.currentTarget);
      setSelectedProgram(program);
    },
    [],
  );

  const handleCloseOptions = () => {
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setDialogMode(null);
    setSelectedProgram(null);
  };

  useEffect(() => {
    if (searchString.trim() === '') {
      setFilteredPrograms(null);
    } else {
      const lowerCaseSearch = searchString.toLowerCase();
      const filtered = sortedPrograms.filter((program) => {
        const nameMatches = program.name?.toLowerCase().includes(lowerCaseSearch);
        const tagMatches = program.tags.some(tag => 
          tag.name.toLowerCase().includes(lowerCaseSearch)
        );
        return nameMatches || tagMatches;
      });
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

  const handleStartEditProgram = () => {
    handleCloseOptions();
    if (selectedProgram) {
      setDialogSession({ mode: 'edit', program: selectedProgram });
      setDialogMode('edit'); 
    }
  };

  const handleStartCreateProgram = () => {
    setDialogSession({ mode: 'create', program: null });
    setDialogMode('create');
  };

  const handleDialogExited = () => {
    setDialogSession(null); 
  };

  const handleSubmitEditProgram = async (
    name: string,
    desc: string,
    weeks: string,
  ) => {
    if (selectedProgram) {
      const program = selectedProgram;
      handleCloseDialog();
      try {
        await updateProgram({
          programId: program.id,
          programName: name,
          programDescription: desc,
          num_weeks: parseInt(weeks),
        });
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

  const initialFormValues = useMemo(() => {
    if (!dialogSession || dialogSession.mode !== 'edit' || !dialogSession.program) return undefined;
    return {
      programName: dialogSession.program.name,
      programDescription: dialogSession.program.description,
      programWeeks: dialogSession.program.num_weeks.toString(),
    };
  }, [dialogSession]);

  const handleAddTagsClicked = (program: CoachProgram) => {
    setSelectedProgram(program);
    setTagManagerOpen(true);
  }

  const handleAddTagToProgram = async (programId: number, tagId: number) => {
    try {
      await addTagToProgram(programId, tagId);
    } catch (e) {
      console.error('Error adding tag to program:', e);
    }
  }

  const handleRemoveTagFromProgram = async (programId: number, tagId: number) => {
    try {
      await removeTagFromProgram(programId, tagId);
    } catch (e) {
      console.error('Error removing tag from program:', e);
    }
  }

  return (
    <div
      id="programs-wrapper"
      className="flex min-h-screen flex-grow bg-gray-100"
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
              onClick={() => handleStartCreateProgram()}
              type="button"
              className="h-[45px] w-[170px] rounded-md bg-[#4e4eff] px-3 py-2 text-white cursor-pointer"
            >
              + Create Program
            </button>
            <button
              type="button"
              style={{ cursor: 'pointer' }}
              className="ml-5 h-[45px] w-[170px] cursor-pointer rounded-md border bg-white px-3 py-2"
              onClick={() => setTagManagerOpen(true)}
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
            placeholder="Search by program name or tag"
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
              borderRadius: 1
            }}
          ></Input>
        </div>
        <div className="programs-list-container mt-7 flex w-full flex-col">
          <div
            id="programs-list-header"
            className="flex h-12 w-full items-center rounded-tl-md rounded-tr-md bg-[#D8D8E0]"
          >
            <p className="mr-10 ml-6 font-bold">Weeks</p>
            <p className="font-bold">Name</p>
          </div>
          {programsToDisplay.map((program) => (
            <ProgramListItem
              key={program.id}
              program={program}
              open={menuOpen}
              openOptions={handleOpenOptions}
              handleAddTagsToProgram={handleAddTagsClicked}
              handleRemoveTagFromProgram={handleRemoveTagFromProgram}
            />
          ))}
        </div>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleCloseOptions}
          MenuListProps={{ 'aria-labelledby': 'basic-button' }}
          sx={{rounded: 1, mt: 0.5}}
        >
          <MenuItem onClick={() => handleStartEditProgram()}>
            <EditIcon sx={{mr: 2}}/>
            Edit program
          </MenuItem>
          <MenuItem onClick={() => handleDuplicateProgram()}>
            <ContentCopyIcon sx={{mr: 2}}/>
            Duplicate program
          </MenuItem>
          <MenuItem onClick={() => handleDeleteProgram()} sx={{ color: 'red' }}>
            <DeleteIcon sx={{mr: 2}}/>
            Delete program
          </MenuItem>
        </Menu>
      </div>
      <CreateOrEditProgramDialog
        open={dialogMode !== null}
        closeDialog={() => setDialogMode(null)}
        submitProgram={(name, desc, weeks) => {
          if (isEditing) {
            handleSubmitEditProgram(name, desc, weeks);
          } else {
            handleCreateProgram(name, desc, weeks);
          }
        }}
        initialValues={initialFormValues}
        onExited={handleDialogExited}
      />
      <TagManager
        key="tag-manager"
        isOpen={tagManagerOpen}
        handleClose={() => { 
          setTagManagerOpen(false);
          setTimeout(() => {
            setSelectedProgram(null);
          }, 200);
        }}
        selectedProgram={selectedProgram}
        handleAddTagToProgram={handleAddTagToProgram}
      />
    </div>
  );
};

export default CoachPrograms;
