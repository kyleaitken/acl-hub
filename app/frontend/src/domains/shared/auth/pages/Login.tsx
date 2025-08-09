import { useEffect, useState } from 'react';
import logo from '../../../../assets/images/Logo.png';
import { useNavigate } from 'react-router-dom';
import { Paper } from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { useLogin } from '../hooks/useLogin';
import { useClientData } from '../../../coach/homefeed/hooks/useClientData';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [coachSelected, setCoachSelected] = useState(true);
  const [showFailedLogin, setShowFailedLogin] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useLogin();
  const { token, role } = useAuthStore();
  const { fetchClients } = useClientData();

  const handleSignUp = () => {
    navigate('/signup');
  };

  useEffect(() => {
    if (token) {
      navigate(role === 'coach' ? '/coach' : '/client');
    }
  }, []);

  const handleLogin = async () => {
    try {
      const userRole = await loginUser(email, password, coachSelected);
      const token = useAuthStore.getState().token;

      if (userRole === 'coach' && token) {
        await fetchClients(token);
        navigate('/coach');
      } else {
        navigate('/client');
      }
    } catch (err) {
      setShowFailedLogin(true);
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Paper className="min-h-[580px] w-[450px]">
        <div className="flex flex-col">
          <img
            className="mt-7 mb-5 h-22 w-22 self-center"
            src={logo}
            alt="Logo"
          />
          <h2 className="mb-2 self-center text-xl font-bold text-blue-700">
            Choose Account Type
          </h2>
          <div className="mt-3 flex self-center">
            <button
              className={`mr-4 w-[100px] cursor-pointer rounded-md ${
                coachSelected && 'bg-[#4e4eff]'
              }`}
              onClick={() => setCoachSelected(true)}
            >
              <p className={` ${coachSelected ? 'text-white' : 'text-black'}`}>
                Coach
              </p>
            </button>
            <button
              className={`mr-4 h-8 w-[100px] cursor-pointer rounded-md ${
                !coachSelected && 'bg-[#4e4eff]'
              }`}
              onClick={() => setCoachSelected(false)}
            >
              <p className={` ${coachSelected ? 'text-black' : 'text-white'}`}>
                Client
              </p>
            </button>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="mx-8 my-5 flex flex-col">
              <p className="mb-1 text-sm font-bold">Email</p>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="h-12 w-95 rounded-md border border-gray-300 p-3 text-md focus:border-blue-400 focus:outline-none"
              />
              <p className="mt-5 mb-1 text-sm font-bold">Password</p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="h-12 w-95 rounded-md border border-gray-300 p-3 text-md focus:border-blue-400 focus:outline-none"
              />
              {showFailedLogin && (
                <div className="mt-5 rounded-md bg-[#ffd3d3] px-5 py-5 text-center shadow-sm">
                  <p>Incorrect email/password combination</p>
                </div>
              )}
              <button
                type="submit"
                className="mt-5 h-10 cursor-pointer rounded-md bg-[#4e4eff] text-md text-white hover:bg-blue-700"
              >
                Log In
              </button>
            </div>
          </form>
          <div className="mx-6 my-1 flex items-center justify-items-center">
            <div className="h-[1px] flex-1 bg-[#ccc]" />
            <p className="mx-3 text-sm text-[#888]">or</p>
            <div className="h-[1px] flex-1 bg-[#ccc]" />
          </div>
          <button
            className="my-4 cursor-pointer align-middle hover:underline"
            onClick={handleSignUp}
          >
            <span>Don't have a coach account? </span>
            <span className='text-blue-700'>Sign up</span>
          </button>
        </div>
      </Paper>
    </div>
  );
};

export default LoginPage;
