import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './domains/shared/auth/pages/Login';
import CoachHomePage from './domains/coach/homepage/pages/CoachHomePage';
import CoachPrograms from './domains/coach/programs/pages/CoachPrograms';
import NavigationBar from './domains/coach/core/components/NavigationBar';
import SignupPage from './domains/shared/auth/pages/SignupPage';
import './styles/styles.css';
import { useAuthStore } from './domains/shared/auth/store/authStore';
import ProtectedRoute from './domains/shared/auth/components/ProtectedRoute';
import { useEffect } from 'react';
import { Role } from './domains/shared/auth/types';
import CoachLibrary from './domains/coach/library/layout/CoachLibrary';
import EditExercise from './domains/coach/library/pages/EditExercise';
import ExercisesView from './domains/coach/library/pages/ExercisesView';
import WarmupsView from './domains/coach/library/pages/WarmupsView';
import CooldownsView from './domains/coach/library/pages/CooldownsView';
import MetricsView from './domains/coach/library/pages/MetricsView';
import AddExercise from './domains/coach/library/pages/AddExercise';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './domains/coach/core/components/ScrollToTop';
import AddWarmup from './domains/coach/library/pages/AddWarmup';
import EditWarmup from './domains/coach/library/pages/EditWarmup';

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
        <ScrollToTop />
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
          <Route
            path="/coach/library"
            element={
              <ProtectedRoute allowedRoles={['coach']}>
                <CoachLibrary />
              </ProtectedRoute>
            }
          >
            <Route index element={<ExercisesView />} />
            <Route path="exercises" element={<ExercisesView />} />
            <Route path="warmups" element={<WarmupsView />} />
            <Route path="warmups/add" element={<AddWarmup />} />
            <Route path="warmups/:warmupId/edit" element={<EditWarmup />} />
            <Route path="cooldowns" element={<CooldownsView />} />
            <Route path="metrics" element={<MetricsView />} />
            <Route path="exercises/:exerciseId/edit" element={<EditExercise />} />
            <Route path="exercises/add" element={<AddExercise />} />
            <Route path="*" element={<Navigate to="/coach/library/exercises" replace />} />
          </Route>
        </Routes>
      </div>
      <Toaster position="top-center" />
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

