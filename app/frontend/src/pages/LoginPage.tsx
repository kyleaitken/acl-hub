import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../slices/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Switch, FormControlLabel } from '@mui/material';
import authService from '../services/authService';
import { fetchUsers } from '../slices/thunks/userThunks';
import { AppDispatch, RootState } from '../store';
import { fetchTodayWorkouts, fetchUpdatedWorkouts } from '../slices/thunks/workoutThunks';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCoach, setIsCoach] = useState(false);  // state to track the role
  const { role, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && role) {
      if (role === "coach") {
        navigate("/coach")
      }
    }
  }, [])

  const handleLogin = async () => {
    try {
      const role = isCoach ? 'coach' : 'user';  // determine the role based on the toggle
      const token: string = await authService.loginUser(email, password, role);
      dispatch(login({ token, role }));
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
