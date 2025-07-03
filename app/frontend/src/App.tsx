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
import { Role } from './domains/shared/auth/types';

function App() {
  const { isLoggedIn, role } = useAuthStore();

  return (
    <div className="flex min-h-screen font-['Montserrat']">
      {role == 'coach' && isLoggedIn && (
        <div className="flex sticky top-0">
          <NavigationBar />
        </div>
      )}
      <div className='flex-grow'>
      <Routes>
        <Route path="/" element={<RedirectHome isLoggedIn={isLoggedIn} role={role}/>} />
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
      </div>
    </div>
  );
}

export default App;


const RedirectHome = (props: {isLoggedIn: boolean, role: Role | null}) => {
  const { isLoggedIn, role } = props;
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

