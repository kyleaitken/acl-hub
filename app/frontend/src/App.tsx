import { Route, Routes } from 'react-router-dom';
import Login from './features/auth/pages/Login';
import CoachHomePage from './features/coach/pages/CoachHomePage';
import CoachPrograms from './features/coach/pages/CoachPrograms';
import NavigationBar from './features/coach/components/NavigationBar';
import SignupPage from './features/auth/pages/SignupPage';
import './styles/styles.css';
import { useAuthStore } from './features/auth/store/authStore';
import ProtectedRoute from './features/auth/components/ProtectedRoute';

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
