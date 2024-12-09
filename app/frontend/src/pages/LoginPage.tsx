import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../slices/auth/authSlice';
import logo from '../assets/images/Logo.png'; 
import { useNavigate } from 'react-router-dom';
import { Box, styled, Paper, Stack, Button, Typography, OutlinedInput } from '@mui/material';
import authService from '../services/authService';
import { fetchUsers } from '../slices/thunks/userThunks';
import { AppDispatch, RootState } from '../store';
import { fetchTodayWorkouts, fetchUpdatedWorkouts } from '../slices/thunks/workoutThunks';

interface LoginData {
  token: string;
  first_name: string;
  last_name: string;
  id: number;
  role: 'coach' | 'user';
}

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCoach, setIsCoach] = useState(true); 
  const [showFailedLogin, setShowFailedLogin] = useState(false);
  const { role, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup")
  }

  useEffect(() => {
    if (token) {
      if (role === "coach") {
        navigate("/coach")
      } else {
        navigate("/user")
      }
    }
  }, [])

  const handleLogin = async () => {
    try {
      const role = isCoach ? 'coach' : 'user'; 
      const loginData: LoginData = await authService.loginUser(email, password, role);
      const token = loginData.token;
      dispatch(login({...loginData}));
      if (role === 'coach') {
        dispatch(fetchUsers(token));  
        dispatch(fetchTodayWorkouts());
        dispatch(fetchUpdatedWorkouts());
        navigate('/coach');
      } else {
        navigate('/user');
      }
    } catch (error) {
      console.error('Login error:', error);
      setShowFailedLogin(true);
    }
  };

  return (
    <LoginView className="loginBox">
      <Paper sx={{minHeight: '580px', width: '450px'}}>
        <Stack >
          <img 
            style={{ width: '90px', height: '90px', marginTop: '30px', marginBottom: '20px', alignSelf: 'center' }} 
            src={logo} 
            alt="Logo" 
          />
          <Typography sx={{alignSelf: 'center', fontSize: '20px', fontWeight: '600', color: 'violet'}}>Choose Account Type</Typography>
          <Box sx={{alignSelf: 'center', display: 'flex', mt: '10px'}}>
            <Button 
              disableRipple
              sx={{
                textTransform: 'none', mr: '10px', 
                backgroundColor: isCoach ? '#4e4eff' : 'none', 
                width: '90px', 
                '&:hover': {
                  background: isCoach ? '#4e4eff' : 'none'

                } 
              }}
              onClick={() => setIsCoach(true)}
            >
              <Typography sx={{color: isCoach ? 'white' : 'black'}}>Coach</Typography>
            </Button>
            <Button 
              disableRipple
              sx={{
                textTransform: 'none', mr: '10px', 
                backgroundColor: !isCoach ? '#4e4eff' : 'none', 
                width: '90px', 
                '&:hover': {
                  background: !isCoach ? '#4e4eff' : 'none'

                } 
              }}
              onClick={() => setIsCoach(false)}
            >
              <Typography sx={{color: isCoach ? 'black' : 'white'}}>Client</Typography>
            </Button>          
          </Box>
          <form
            onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
            }}
          >
            <Stack sx={{margin: '20px 40px'}}>
              <Typography sx={{fontSize: '14px', fontWeight: '600', mb: '2px'}}>Email</Typography>
              <OutlinedInput value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" autoComplete='username'/>
              <Typography sx={{fontSize: '14px', fontWeight: '600', marginTop: '20px', mb: '2px'}}>Password</Typography>
              <OutlinedInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete='current-password'
              />
              {showFailedLogin && (
                <Paper sx={{backgroundColor: '#ffd3d3', mt: '20px'}}>
                  <Typography sx={{padding: '20px 10px', textAlign: 'center'}}>Incorrect email/password combination</Typography>
                </Paper>
              )}
              <Button 
                type="submit"
                sx={{
                  backgroundColor: '#4e4eff', 
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '16px',
                  mt: '20px',
                  '&:hover':{
                    backgroundColor: 'blue'
                  }
                }} 
                onClick={handleLogin}
              >
                Log In
              </Button>
            </Stack>
          </form>
          <Box sx={{display: 'flex', alignItems: 'center', my: '2px', marginX: '30px'}}>
            <Box
              sx={{
                flex: 1, 
                height: '1px', 
                backgroundColor: '#ccc',
              }}
            />
            <Typography 
              sx={{
                mx: 2, // Adds horizontal margin around the text
                color: '#888', // Text color
                fontSize: '14px',
              }}
            >
              or
            </Typography>
            <Box 
              sx={{
                flex: 1, 
                height: '1px', 
                backgroundColor: '#ccc',
              }}
            />           
          </Box>
          <Button sx={{textTransform: 'none', alignSelf: 'center', mt: '10px', color: 'blue', '&:hover': {textDecoration: 'underline', background: 'transparent'}}} onClick={handleSignUp}>Don't have a coach account? Sign up</Button>
        </Stack>
      </Paper>
    </LoginView>
  );
};

export default LoginPage;

const LoginView = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center', // Center the Paper vertically
  height: '100vh',
  backgroundColor: theme.palette.grey[100],
}));