import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from "react-router-dom";
import Login from './features/auth/pages/Login';
import { RootState } from "./store";
import CoachHomePage from './pages/Coach/CoachHomePage';
import CoachPrograms from './pages/Coach/CoachPrograms';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './components/Coach/NavigationBar';
import { Box, CssBaseline, styled, ThemeProvider } from '@mui/material';
import { lightTheme, darkTheme } from './context/themes';
import { toggleTheme } from './slices/preferences/preferencesSlice';
import SignupPage from './pages/SignupPage';
import './styles/index.css';
import { useAuthStore } from './features/auth/store/authStore';

function App() {
  const { isDarkMode } = useSelector((state: RootState) => state.preferences)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, role } = useAuthStore();


  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login")
    }
  }, [isLoggedIn])

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      {role == 'coach' && isLoggedIn && 
        <NavBarView id="nav_bar_view">
          <NavigationBar toggleTheme={handleToggleTheme}/>
        </NavBarView>
      }
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/coach" element={<CoachHomePage />} />
          <Route path="/coach/programs" element={<CoachPrograms />} />
        </Routes>
    </ThemeProvider>
  );
}

export default App;

const NavBarView = styled(Box)`
  display: flex;
  width: 220px;
  min-height: 100vh;
  position: fixed;
  top: 0;
  z-index: 1000;
`