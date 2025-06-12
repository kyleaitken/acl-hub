import { Route, Routes } from 'react-router-dom';
import Login from './features/auth/pages/Login';
import CoachHomePage from './pages/Coach/CoachHomePage';
import CoachPrograms from './pages/Coach/CoachPrograms';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './features/coach/components/NavigationBar';
import SignupPage from './features/auth/pages/SignupPage';
import './styles/styles.css';
import { useAuthStore } from './features/auth/store/authStore';

function App() {
  const navigate = useNavigate();
  const { isLoggedIn, role } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/signup');
    }
  }, [isLoggedIn]);

  return (
    <>
      {role == 'coach' && isLoggedIn && (
        <div className="fixed top-0 z-[1000] flex min-h-screen w-[220px] font-['Montserrat']">
          <NavigationBar />
        </div>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/coach" element={<CoachHomePage />} />
        <Route path="/coach/programs" element={<CoachPrograms />} />
      </Routes>
    </>
  );
}

export default App;
