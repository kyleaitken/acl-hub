import { Box, Button, styled } from "@mui/material";
import { Link, useNavigate } from 'react-router-dom'; 
import logo from '../../assets/images/Logo.png'; 
import PeopleIcon from '@mui/icons-material/People';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ForumIcon from '@mui/icons-material/Forum';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import authService from "../../services/authService";
import { logout } from "../../slices/auth/authSlice";
import LogoutIcon from '@mui/icons-material/Logout';
import { persistor } from '../../store';

interface NavigationBarProps {
    toggleTheme: () => void;
}

const NavigationBar = (props: NavigationBarProps) => {
    const { toggleTheme } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state: RootState) => state.auth);

    const handleLogout = async () => {
        if (token) {
            try {
                await authService.logoutUser("coach", token);
            } catch (error) {
                console.error("Failed to log out:", error);
            } 
            dispatch(logout()); 
            navigate('/login');
            persistor.purge();
        } else {
            navigate('/login');
        }
    }

    return (
        <NavBarView>

            <Link to="/coach">
                <img 
                    style={{ width: '70px', height: '70px', marginTop: '20px', alignSelf: 'center' }} 
                    src={logo} 
                    alt="Logo" 
                />
            </Link> 

            <LinkContainer>          
                <StyledLink to="/coach/clients">
                    <PeopleIcon sx={{marginRight: '10px'}} />
                    Clients
                </StyledLink>
                <StyledLink to="/coach/programs">
                    <AssignmentIcon sx={{marginRight: '10px'}} />
                    Programs
                </StyledLink>
                <StyledLink to="/coach/exerciseLibrary">
                    <FitnessCenterIcon sx={{marginRight: '10px'}}/>
                    Exercise Library
                </StyledLink>
                <StyledLink to="/coach/messages">
                    <ForumIcon sx={{marginRight: '10px'}}/>
                    Messages
                </StyledLink>
            </LinkContainer>

            <ButtonView>
                <Button sx={(theme) => ({color: theme.palette.text.secondary, fontWeight: 600})} onClick={toggleTheme}>Toggle Theme</Button>
            </ButtonView>
            <ButtonView>
                <LogoutIcon />
                <Button onClick={handleLogout} sx={(theme) => ({color: theme.palette.text.secondary, fontWeight: 600})}>Logout</Button>
            </ButtonView>

        </NavBarView>
    )
};

export default NavigationBar;

const NavBarView = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.secondary.main,
    flexDirection: 'column',
}));

const StyledLink = styled(Link)(({ theme }) => ({
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600',
    padding: '8px 16px',
    display: 'flex',
    marginTop: '20px',
    '&:hover': {
        color: theme.palette.primary.dark,
        textDecoration: 'underline',
    },
    color: theme.palette.text.secondary
}));

const LinkContainer = styled(Box)`
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    flex-grow: 1; 
`

const ButtonView = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    width: '200px',
    color: theme.palette.text.secondary,
    marginBottom: '20px',
    marginLeft: '20px',
}));