import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/images/Logo.png';
import PeopleIcon from '@mui/icons-material/People';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ForumIcon from '@mui/icons-material/Forum';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import { persistor } from '../../../store';
import { useLogin } from '../../../features/auth/hooks/useLogin';
import { useAuthStore } from '../../../features/auth/store/authStore';
import { useThemeStore } from '../../../store/themeStore';

const NavigationBar = () => {
  const { toggleTheme, theme } = useThemeStore();
  const navigate = useNavigate();
  const oppositeTheme = theme === 'dark' ? 'Light Mode' : 'Dark Mode';

  const { isLoggedIn, token, role } = useAuthStore();
  const { logoutUser } = useLogin();

  const handleLogout = async () => {
    if (isLoggedIn && token && role) {
      const success = await logoutUser(role, token);
      if (!success) {
        console.error('Backend logout failed — fallback to manual clear');
      }
    }
    navigate('/login');
    persistor.purge();
  };

  return (
    <div className="flex flex-col items-center bg-[var(--color-secondary)] text-[var(--color-text-light)]">
      <Link to="/coach">
        <img
          style={{
            width: '70px',
            height: '70px',
            marginTop: '20px',
            alignSelf: 'center',
          }}
          src={logo}
          alt="Logo"
        />
      </Link>
      <div className="flex grow flex-col self-start">
        <div className={styledLinkClasses}>
          <Link to="/coach/clients">
            <PeopleIcon sx={{ marginRight: '10px' }} />
            Clients
          </Link>
        </div>
        <div className={styledLinkClasses}>
          <Link to="/coach/programs">
            <AssignmentIcon sx={{ marginRight: '10px' }} />
            Programs
          </Link>
        </div>
        <div className={styledLinkClasses}>
          <Link to="/coach/exerciseLibrary">
            <FitnessCenterIcon sx={{ marginRight: '10px' }} />
            Exercise Library
          </Link>
        </div>
        <div className={styledLinkClasses}>
          <Link to="/coach/messages">
            <ForumIcon sx={{ marginRight: '10px' }} />
            Messages
          </Link>
        </div>
      </div>

      <ButtonView>
        <button
          onClick={() => toggleTheme()}
          className="cursor-pointer hover:underline"
        >
          {oppositeTheme}
        </button>
      </ButtonView>

      <ButtonView>
        <button
          className="flex cursor-pointer items-center gap-2 hover:underline"
          onClick={handleLogout}
        >
          <span>
            <LogoutIcon />
          </span>{' '}
          Logout
        </button>
      </ButtonView>
    </div>
  );
};

const ButtonView = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-5 ml-5 flex w-[200px] items-center font-semibold text-[var(--color-text-light)]">
    {children}
  </div>
);

export default NavigationBar;

const styledLinkClasses =
  'no-underline text-base font-semibold px-4 py-2 flex mt-5 hover:underline flex items-center gap-2';
