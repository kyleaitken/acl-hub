import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import { RootState } from "./store";
import CoachHomePage from './pages/Coach/CoachHomePage';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './components/Coach/NavigationBar';
import { Box, CssBaseline, styled, ThemeProvider } from '@mui/material';
import { lightTheme, darkTheme } from './context/themes';
import { toggleTheme } from './slices/preferences/preferencesSlice';

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
      <AppContainer>
        {role == 'coach' && <NavigationBar toggleTheme={handleToggleTheme}/>}
        <MainView>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/coach" element={<CoachHomePage />} />
            </Routes>
          </MainView>
        </AppContainer>
    </ThemeProvider>
  );
}

export default App;

const MainView = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor: theme.palette.background.default,
  flexGrow: 1
}));

const AppContainer = styled(Box)`
  display: flex;
`
