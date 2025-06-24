import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './domains/shared/auth/pages/Login';
import CoachHomePage from './domains/coach/pages/CoachHomePage';
import CoachPrograms from './domains/coach/pages/CoachPrograms';
import NavigationBar from './domains/coach/components/NavigationBar';
import SignupPage from './domains/shared/auth/pages/SignupPage';
import './styles/styles.css';
import { useAuthStore } from './domains/shared/auth/store/authStore';
import ProtectedRoute from './domains/shared/auth/components/ProtectedRoute';
import { useEffect } from 'react';

function App() {
  const { isLoggedIn, role } = useAuthStore();

  return (
    <>
      {role == 'coach' && isLoggedIn && (
        <div className="fixed top-0 z-[1000] flex min-h-screen w-[220px] font-['Montserrat']">
          <NavigationBar />
        </div>
      )}
      <Routes>
        <Route path="/" element={<RedirectHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
        <Route
          path="/coach"
          element={
            <ProtectedRoute allowedRoles={['coach']}>
              <CoachHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coach/programs"
          element={
            <ProtectedRoute allowedRoles={['coach']}>
              <CoachPrograms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/testRoute"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <CoachPrograms />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;


const RedirectHome = () => {
  const { isLoggedIn, role } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (role === 'coach') {
      navigate('/coach');
    } else if (role === 'client') {
      navigate('/client');
    } else {
      navigate('/unauthorized');
    }
  }, [isLoggedIn, role, navigate]);

  return <div>Redirecting...</div>; 
};

