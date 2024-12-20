import { Box, Button, Input, styled, Typography } from "@mui/material";

const CoachPrograms = () => {
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
                            }}>
                            <Typography>Manage Tags</Typography>
                        </Button>
                    </Box>
                </Box>
                <Box id="programsSearchAndFiltersBox" sx={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                    <form>
                        <Input>
                        </Input>
                    </form>
                    <Button>Filters</Button>
                </Box>
            </ProgramsContainer>
        
        </ProgramsView>
    )
};

export default CoachPrograms;

const ProgramsView = styled(Box)(({ theme }) => ({
    display: 'flex',
    backgroundColor: theme.palette.grey[200],
    flexGrow: 1,
    marginLeft: '220px',
    minHeight: '100vh'
}));

const ProgramsContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    margin: 60px 450px;
`