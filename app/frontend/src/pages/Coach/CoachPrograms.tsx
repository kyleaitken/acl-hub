import { Box, Button, Input, InputAdornment, Menu, MenuItem, styled, Typography } from "@mui/material";
import TuneIcon from '@mui/icons-material/Tune';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from "react";
import { CoachProgram, RootState } from "../../types/types";
import { fetchCoachPrograms } from "../../services/programsService";
import { useSelector } from "react-redux";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SendIcon from '@mui/icons-material/Send';
import React from "react";

const CoachPrograms = () => {
    const [programs, setPrograms] = useState<CoachProgram[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const { token } = useSelector((state: RootState) => state.auth);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const fetchPrograms = async () => {
            if (token) {
                setLoading(true);
                setError(null);
                try {
                    const programs = await fetchCoachPrograms(token);
                    setPrograms(programs);
                } catch (err) {
                    console.error("Error fetching programs:", err);
                    setError('Failed to fetch programs. Please try again.');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchPrograms();
    }, [token]); 

    const defaultDescription = "here's a really long description for the program that shiould stretch to more than one line and keep on and keep on and keep on and keep on and keep on and keepn on"

    return (
        <ProgramsView id="programsView">
            <ProgramsContainer id="programsContainer">
                <Box id="programsHeaderBox" sx={{display: "flex", alignItems: 'center', width: '100%'}}>
                    <Typography sx={{flexGrow: '1', fontSize: '20px', fontWeight: '600'}}>Programs</Typography>
                    <Box>
                        <Button 
                            sx={{color: 'white', backgroundColor: '#4e4eff', textTransform: 'none',
                                padding: '8px 10px',
                                width: '170px',
                                height: '45px',
                                '&:hover':{
                                    backgroundColor: 'blue'
                                }
                            }}>
                            <Typography>+ Create Program</Typography>
                        </Button>
                        <Button 
                            sx={{color: 'black', backgroundColor: 'white', textTransform: 'none',
                                padding: '8px 10px',
                                border: '1px solid black',
                                ml: '20px',
                                width: '170px',
                                height: '45px'
                            }}>
                            <Typography>Manage Tags</Typography>
                        </Button>
                    </Box>
                </Box>
                <Box id="programsSearchAndFiltersBox" sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', mt: '60px'}}>
                    <form style={{flexGrow: 1}}>
                        <Input 
                            fullWidth 
                            disableUnderline
                            placeholder="Search"
                            startAdornment={
                                <InputAdornment position="start">
                                  <SearchIcon sx={(theme) => ({color: theme.palette.grey[400]})} />
                                </InputAdornment>
                            }
                            sx={{     
                                padding: '10px',
                                border: '1px solid black',
                                backgroundColor: 'white',
                                height: '45px'
                            }}>
                        </Input>
                    </form>
                    <Button 
                        sx={{color: 'black', backgroundColor: 'white', textTransform: 'none',
                            padding: '8px 10px',
                            border: '1px solid black',
                            ml: '20px',
                            width: '170px',
                            height: '45px'
                        }}>
                        <Typography sx={{display: 'flex', alignItems: 'center'}}>
                            <TuneIcon sx={{mr: '5px'}}/>
                            Filters
                        </Typography>
                    </Button>
                </Box>
                <ProgramsListBox>
                    <Header>
                        <Typography sx={{fontSize: '18px', fontWeight: 600, ml: '20px', mr: '40px'}}>Weeks</Typography>
                        <Typography sx={{fontSize: '18px', fontWeight: 600}}>Name</Typography>
                    </Header>
                    {programs.map((program) => (
                        <div 
                            style={{
                                display: 'flex', paddingLeft: '20px', paddingBottom: '15px', 
                                alignItems: 'center', backgroundColor: 'white', 
                                paddingTop: '10px', border: '2px solid lightgray'
                            }} 
                            key={program.id}>
                            <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', mt: '10px', mr: '60px'}}>
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
                                    6
                                </Box>
                            </Box>
                            <Box sx={{display: 'flex', flexDirection: 'column', mt: '10px', flexGrow: 1}}>
                                <Typography sx={{fontSize: '16px', fontWeight: 600}}>{program.name}</Typography>
                                <Typography sx={{fontSize: '15px', mt: '5px', maxWidth: '95%'}}>{program.description || defaultDescription}</Typography>
                            </Box>
                            <Box sx={{mr: '25px', minWidth: '280px'}}>
                                <Button
                                    sx={{color: 'black', backgroundColor: 'white', textTransform: 'none',
                                        padding: '8px 10px',
                                        border: '1px solid black',
                                        ml: '20px',
                                        width: '170px',
                                        height: '35px'
                                    }}
                                >
                                    <SendIcon sx={{fontSize: '20px', mr: '5px'}}/>
                                    <Typography sx={{fontSize: '15px'}}>Assign To Client</Typography>
                                </Button>
                                <Button
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                    sx={{color: 'black', backgroundColor: 'white', textTransform: 'none',
                                        padding: '8px 10px',
                                        border: '1px solid black',
                                        ml: '20px',
                                        width: '30px',
                                        height: '35px'
                                    }}
                                >
                                    <Typography sx={{fontSize: '25px', paddingBottom: '12px'}}>...</Typography>
                                </Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem onClick={handleClose}>Edit program</MenuItem>
                                    <MenuItem onClick={handleClose}>Delete program</MenuItem>
                                    <MenuItem onClick={handleClose}>Duplicate program</MenuItem>
                                </Menu>
                            </Box>
                        </div>
                    ))}
                </ProgramsListBox>
            </ProgramsContainer>
        </ProgramsView>
    )
};

export default CoachPrograms;

const ProgramsView = styled(Box)(({ theme }) => ({
    display: 'flex',
    backgroundColor: theme.palette.grey[100],
    flexGrow: 1,
    marginLeft: '220px',
    minHeight: '100vh'
}));

const ProgramsContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    margin: 60px 300px;
`
const ProgramsListBox = styled(Box)`  
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 30px;
`

const Header = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    height: '50px',
    backgroundColor: '#D8D8E0',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px'
}));