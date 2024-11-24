import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../slices/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Switch, FormControlLabel } from '@mui/material';
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
  const [isCoach, setIsCoach] = useState(false); 
  const { role, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

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
    }
  };

  return (
    <div>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      
      {/* Toggle switch for Coach/User role */}
      <FormControlLabel
        control={<Switch checked={isCoach} onChange={() => setIsCoach(!isCoach)} />}
        label={isCoach ? 'Coach' : 'User'}
      />
      
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
