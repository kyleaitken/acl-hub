import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../../assets/images/Logo.png';
import PeopleIcon from '@mui/icons-material/People';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ForumIcon from '@mui/icons-material/Forum';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLogin } from '../../../shared/auth/hooks/useLogin';
import { useAuthStore } from '../../../shared/auth/store/authStore';
import { useThemeStore } from '../../../shared/stores/themeStore';
import { useState } from 'react';

const NavigationBar = () => {
  const [tabSelected, setTabSelected] = useState('');
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
  };

  const tabs = [
    {
      id: "clients",
      url: "/coach/clients",
      name: "Clients",
      icon: PeopleIcon
    }, 
    {
      id: "programs",
      url: "/coach/programs",
      name: "Programs",
      icon: AssignmentIcon
    }, 
    {
      id: "library",
      url: "/coach/library",
      name: "Library",
      icon: FitnessCenterIcon
    }, 
    {
      id: "messages",
      url: "/coach/messages",
      name: "Messages",
      icon: ForumIcon
    }, 
  ]

  return (
    <div className="navBarWrapper sticky top-0 max-h-screen flex flex-col items-center bg-[var(--color-secondary)] text-[var(--color-text-light)]">
      <Link to="/coach" onClick={() => setTabSelected('')}>
        <img
          style={{
            width: '70px',
            height: '70px',
            marginTop: '20px',
            marginBottom: '20px',
            alignSelf: 'center',
          }}
          src={logo}
          alt="Logo"
        />
      </Link>
      <div className="linksContainer flex-grow flex-col self-start w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tabSelected === tab.id;
          const className = isActive ? tabSelectedClasses : styledLinkClasses;

          return (
            <Link
              key={tab.id}
              to={tab.url}
              onClick={() => setTabSelected(tab.id)}
              className={className}
            >
              <Icon sx={{ marginRight: '10px' }} />
              {tab.name}
            </Link>
          );
        })}
      </div>
      <div>
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
  'no-underline text-base font-semibold px-4 py-4 flex hover:underline flex items-center gap-2';

const tabSelectedClasses = 
  'no-underline text-base font-semibold px-4 py-4 flex hover:underline flex items-center gap-2 border-r-5 border-r-blue-500';
