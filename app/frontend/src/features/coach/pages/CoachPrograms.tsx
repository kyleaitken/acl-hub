import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Input,
  InputAdornment,
  Menu,
  MenuItem,
  styled,
  Typography,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useMemo, useState } from 'react';
import { CoachProgram, RootState } from '../../../types/types';
import {
  fetchCoachPrograms,
  addCoachProgram,
  deleteCoachProgram,
  updateCoachProgram,
} from '../../../services/programsService';
import { useSelector } from 'react-redux';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SendIcon from '@mui/icons-material/Send';
import React from 'react';

const CoachPrograms = () => {
  const [programs, setPrograms] = useState<CoachProgram[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<
    CoachProgram[] | null
  >(null);
  const [searchString, setSearchString] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createProgramVisible, setCreateProgramVisible] = useState(false);
  const [editProgramId, setEditProgramId] = useState<number | null>(null);
  const [editProgramName, setEditProgramName] = useState('');
  const [editProgramDescription, setEditProgramDescription] = useState('');
  const [programName, setProgramName] = useState('');
  const [programDescription, setProgramDescription] = useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [optionsOpenIndex, setOptionsOpenIndex] = useState<number>(-1);
  const open = Boolean(anchorEl);

  const { token } = useSelector((state: RootState) => state.auth);

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
    if (programName !== '' && token) {
      try {
        await addCoachProgram(token, programName, programDescription);
        fetchPrograms();
      } catch (err) {
        console.error('Error adding program:', err);
        setError('Failed to add program. Please try again.');
      } finally {
        handleCloseDialog();
      }
    }
  };

  const handleDeleteProgram = async () => {
    const index = optionsOpenIndex;
    const id = sortedPrograms[index].id;
    handleCloseOptions();
    if (token) {
      try {
        await deleteCoachProgram(token, id);
        fetchPrograms();
      } catch (err) {
        console.error('Error deleting program:', err);
        setError('Failed to delete program. Please try again.');
      }
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
    if (token && editProgramId) {
      try {
        updateCoachProgram(
          token,
          editProgramId,
          editProgramName,
          editProgramDescription,
        );
        handleCloseDialog();
        fetchPrograms();
      } catch (err) {}
    }
  };

  const handleDuplicateProgram = async () => {
    const program = sortedPrograms[optionsOpenIndex];
    handleCloseOptions();
    if (token) {
      try {
        await addCoachProgram(
          token,
          program.name,
          program.description,
          program.num_weeks,
        );
        fetchPrograms();
      } catch (err) {
        console.error('Error duplicating program:', err);
        setError('Failed to duplicate program. Please try again.');
      }
    }
  };

  const fetchPrograms = async () => {
    if (token) {
      setLoading(true);
      setError(null);
      try {
        const programs = await fetchCoachPrograms(token);
        setPrograms(programs);
      } catch (err) {
        console.error('Error fetching programs:', err);
        setError('Failed to fetch programs. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const sortedPrograms = useMemo(() => {
    return programs
      .slice()
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [programs]);

  const programsToDisplay = filteredPrograms ?? sortedPrograms;

  useEffect(() => {
    fetchPrograms();
  }, []);

  return (
    <ProgramsView id="programsView">
      <ProgramsContainer id="programsContainer">
        <Box
          id="programsHeaderBox"
          sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
        >
          <Typography
            sx={{ flexGrow: '1', fontSize: '20px', fontWeight: '600' }}
          >
            Programs
          </Typography>
          <Box>
            <Button
              onClick={() => setCreateProgramVisible(true)}
              sx={{
                color: 'white',
                backgroundColor: '#4e4eff',
                textTransform: 'none',
                padding: '8px 10px',
                width: '170px',
                height: '45px',
                '&:hover': {
                  backgroundColor: 'blue',
                },
              }}
            >
              <Typography>+ Create Program</Typography>
            </Button>
            <Button
              sx={{
                color: 'black',
                backgroundColor: 'white',
                textTransform: 'none',
                padding: '8px 10px',
                border: '1px solid black',
                ml: '20px',
                width: '170px',
                height: '45px',
              }}
            >
              <Typography>Manage Tags</Typography>
            </Button>
          </Box>
        </Box>
        <Box
          id="programsSearchAndFiltersBox"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            mt: '60px',
          }}
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
          <Button
            sx={{
              color: 'black',
              backgroundColor: 'white',
              textTransform: 'none',
              padding: '8px 10px',
              border: '1px solid black',
              ml: '20px',
              width: '170px',
              height: '45px',
            }}
          >
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              <TuneIcon sx={{ mr: '5px' }} />
              Filters
            </Typography>
          </Button>
        </Box>
        <ProgramsListBox>
          <Header>
            <Typography
              sx={{ fontSize: '18px', fontWeight: 600, ml: '20px', mr: '40px' }}
            >
              Weeks
            </Typography>
            <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
              Name
            </Typography>
          </Header>
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
              <Box sx={{ mr: '25px', minWidth: '280px' }}>
                <Button
                  sx={{
                    color: 'black',
                    backgroundColor: 'white',
                    textTransform: 'none',
                    padding: '8px 10px',
                    border: '1px solid black',
                    ml: '20px',
                    width: '170px',
                    height: '35px',
                  }}
                >
                  <SendIcon sx={{ fontSize: '20px', mr: '5px' }} />
                  <Typography sx={{ fontSize: '15px' }}>
                    Assign To Client
                  </Typography>
                </Button>
                <Button
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={(e) => handleOpenOptions(e, index)}
                  sx={{
                    color: 'black',
                    backgroundColor: 'white',
                    textTransform: 'none',
                    padding: '8px 10px',
                    border: '1px solid black',
                    ml: '20px',
                    width: '30px',
                    height: '35px',
                  }}
                >
                  <Typography sx={{ fontSize: '25px', paddingBottom: '12px' }}>
                    ...
                  </Typography>
                </Button>
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
              </Box>
            </div>
          ))}
        </ProgramsListBox>
      </ProgramsContainer>
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
            <Button
              onClick={handleCreateProgram}
              sx={{
                color: 'white',
                backgroundColor: '#4e4eff',
                textTransform: 'none',
                padding: '8px 10px',
                width: '222px',
                height: '40px',
                mr: '40px',
                '&:hover': {
                  backgroundColor: 'blue',
                },
              }}
            >
              <Typography>Save and add workouts</Typography>
            </Button>
            <Button
              onClick={handleCloseDialog}
              sx={{
                color: 'white',
                backgroundColor: 'red',
                textTransform: 'none',
                padding: '8px 10px',
                width: '110px',
                height: '40px',
                mr: '40px',
                '&:hover': {
                  backgroundColor: 'darkred',
                },
              }}
            >
              <Typography>Cancel</Typography>
            </Button>
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
            <Button
              onClick={handleSubmitEditProgram}
              sx={{
                color: 'white',
                backgroundColor: '#4e4eff',
                textTransform: 'none',
                padding: '8px 10px',
                width: '222px',
                height: '40px',
                mr: '40px',
                '&:hover': {
                  backgroundColor: 'blue',
                },
              }}
            >
              <Typography>Update program</Typography>
            </Button>
            <Button
              onClick={handleCloseDialog}
              sx={{
                color: 'white',
                backgroundColor: 'red',
                textTransform: 'none',
                padding: '8px 10px',
                width: '110px',
                height: '40px',
                mr: '40px',
                '&:hover': {
                  backgroundColor: 'darkred',
                },
              }}
            >
              <Typography>Cancel</Typography>
            </Button>
          </Box>
        </form>
      </Dialog>
    </ProgramsView>
  );
};

export default CoachPrograms;

const ProgramsView = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor: theme.palette.grey[100],
  flexGrow: 1,
  marginLeft: '220px',
  minHeight: '100vh',
}));

const ProgramsContainer = styled(Box)`
  display: flex;
  margin: auto;
  flex-direction: column;
  align-items: center;
  margin-top: 60px;
  width: 1100px;
  margin-bottom: 100px;
`;
const ProgramsListBox = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 30px;
`;

const Header = styled(Box)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  height: '50px',
  backgroundColor: '#D8D8E0',
  borderTopLeftRadius: '10px',
  borderTopRightRadius: '10px',
}));
