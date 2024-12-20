import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from "react-router-dom";
import LoginPage from './pages/LoginPage';
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

function App() {
  const { isDarkMode } = useSelector((state: RootState) => state.preferences)
  const {role, token} = useSelector((state: RootState) => state.auth);
  const isLoggedIn = !!token;
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      {role == 'coach' && token && 
        <NavBarView id="nav_bar_view">
          <NavigationBar toggleTheme={handleToggleTheme}/>
        </NavBarView>
      }
        <Routes>
          <Route path="/login" element={<LoginPage />} />
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