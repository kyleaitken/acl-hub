import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, styled, Paper, Stack, Button, Typography, OutlinedInput } from '@mui/material';
import {CoachSignupData, signupCoach} from '../features/auth/services/authService';
import signup from '../assets/images/signup.jpg'; 

const SignupPage = () => {
  const [imageLoaded, setImageLoaded] = useState(false); // State to track image load 
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [password, setPassword] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isIdenticalPassword, setIsIdenticalPassword] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [isValidFirstName, setIsValidFirstName] = useState(true);
  const [lastName, setLastName] = useState('');
  const [isValidLastName, setIsValidLastName] = useState(true);
  const [phone, setPhone] = useState('');
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [notAllInputsValid, setNotAllInputsValid] = useState(true);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [validation, setValidation] = useState({
    email: true,
    password: true,
    confirmPassword: true,
    firstName: true,
    lastName: true,
    phone: true,
  });

  const handleSignup = async () => {
    try {
        const coachData: CoachSignupData = {
            firstName,
            lastName,
            email,
            phone,
            password,
            confirmPassword,
        };
        await signupCoach(coachData);
        navigate('/login');
    } catch (error) {
      console.log("Error processing signup: ", error)
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
  
    // Remove all non-numeric characters
    const digitsOnly = input.replace(/\D/g, '');
  
    let formattedPhone = digitsOnly;
    if (digitsOnly.length > 6 && digitsOnly.length < 10) {
      formattedPhone = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
    } else if (digitsOnly.length === 10) {
      formattedPhone = `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
    } else if (digitsOnly.length > 10) {
        return;
    }
  
    setPhone(formattedPhone);
    setIsValidPhone(digitsOnly.length === 10 || digitsOnly.length === 0);
    setForm({...form, phone: formattedPhone});
    setValidation({...validation, phone: (digitsOnly.length === 10 || digitsOnly.length === 0)})
  };

  const handleChangeFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsValidFirstName(!(e.target.value === ""));
    setFirstName(e.target.value);
  }

  const handleChangeLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsValidLastName(!(e.target.value === ""));
    setLastName(e.target.value);
  }

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setEmail(input)

    if (input === "") {
        setIsValidEmail(false);
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        setIsValidEmail(emailRegex.test(input));
    }
  }

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setPassword(input);
    setIsValidPassword(input.length >= 8);
  };

  const handleChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setConfirmPassword(input);
    setIsIdenticalPassword(input === password);
  };

  useEffect(() => {
    if (isValidEmail && isValidFirstName && isValidLastName && isValidPhone && isValidPassword && isIdenticalPassword
        && email && phone && firstName && lastName && password && confirmPassword) {
        setNotAllInputsValid(false);
    } else {
        setNotAllInputsValid(true);
    }

  }, [isValidEmail, isValidFirstName, isValidLastName, isValidPassword, isIdenticalPassword, isValidPhone,
        email, phone, firstName, lastName, password, confirmPassword]);

    useEffect(() => {
        const img = new Image();
        img.src = signup;
        img.onload = () => setImageLoaded(true); 
    }, []);

  return (
    <>
    {imageLoaded ? (
    <SignupView className="loginBox">
      <Box sx={{display: 'flex'}}>
        <Box
            component="img"
            src={signup}
            height={800}
            sx={{
                borderTopLeftRadius: '12px', 
                borderBottomLeftRadius: '12px',
            }}
        />
        <Paper sx={{height: '800px', width: '450px', borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px', borderTopRightRadius: '12px', borderBottomRightRadius: '12px', boxShadow: '0'}}>
        <Box>
            <Typography
                sx={{
                    textAlign: 'center',
                    fontSize: '24px',
                    fontWeight: '700',
                    mt: '20px',
                    fontFamily: 'Nunito',
                    mb: 1,
                }}
            >
                Start your ACL Hub account today!
            </Typography>
        </Box>
        <Stack sx={{height: '100%'}}>
          <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSignup();
            }}
          >
            <Stack sx={{margin: '20px 40px'}}>
                {/* Fname */}
                 <Typography sx={{fontSize: '14px', fontWeight: '600', mb: '2px'}}>First Name</Typography>
                <OutlinedInput 
                    value={firstName} 
                    onChange={handleChangeFirstName} 
                    placeholder="Enter first name"
                />
                {!isValidFirstName && (
                <Typography sx={{ color: 'red', fontSize: '14px' }}>
                    First name can't be blank
                </Typography>
                )}

                {/* Lname */}
                <Typography sx={{fontSize: '14px', fontWeight: '600', mb: '2px', mt: '20px'}}>Last Name</Typography>
                <OutlinedInput 
                    value={lastName} 
                    onChange={handleChangeLastName} 
                    placeholder="Enter last name" 
                />
                {!isValidLastName && (
                <Typography sx={{ color: 'red', fontSize: '14px' }}>
                    Last name can't be blank
                </Typography>
                )}

                {/* Phone */}
                <Typography sx={{fontSize: '14px', fontWeight: '600', mb: '2px', mt: '20px'}}>Phone Number</Typography>
                <OutlinedInput 
                    value={phone} 
                    onChange={handlePhoneChange} 
                    placeholder="(902) 555-1234" 
                    autoComplete='username'
                />
                {!isValidPhone && (
                <Typography sx={{ color: 'red', fontSize: '14px' }}>
                    Enter a valid phone number
                </Typography>
                )}

                {/* Email */}
                <Typography sx={{fontSize: '14px', fontWeight: '600', mb: '2px', mt: '20px'}}>Email</Typography>
                <OutlinedInput 
                    value={email} 
                    onChange={handleChangeEmail} 
                    placeholder="Email" 
                    autoComplete='username'
                />
                {!isValidEmail && (
                <Typography sx={{ color: 'red', fontSize: '14px' }}>
                    Enter a valid email
                </Typography>
                )}

                {/* Password */}
                <Typography sx={{fontSize: '14px', fontWeight: '600', marginTop: '20px', mb: '2px'}}>Password</Typography>
                <OutlinedInput
                    type="password"
                    value={password}
                    onChange={handleChangePassword}
                    placeholder="Password"
                    autoComplete='new-password'
                />
                {!isValidPassword && (
                <Typography sx={{ color: 'red', fontSize: '14px' }}>
                    Password must be at least 8 characters
                </Typography>
                )}


                {/* Confirm Password */}
                <Typography sx={{fontSize: '14px', fontWeight: '600', marginTop: '20px', mb: '2px'}}>Confirm Password</Typography>
                <OutlinedInput
                    type="password"
                    value={confirmPassword}
                    onChange={handleChangeConfirmPassword}
                    placeholder="Confirm password"
                    autoComplete='current-password'
                />
                {!isIdenticalPassword && (
                <Typography sx={{ color: 'red', fontSize: '14px' }}>
                    Passwords must match
                </Typography>
                )}

                <Button 
                    sx={{
                    backgroundColor: '#4e4eff', 
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '16px',
                    mt: '40px',
                    '&:hover':{
                        backgroundColor: 'blue'
                    }
                    }} 
                    disabled={notAllInputsValid}
                    onClick={handleSignup}
                >
                    Sign up
                </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
      </Box>
    </SignupView>
    ) : (<> </>)}
    </>)
};

export default SignupPage;

const SignupView = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex', 
  paddingTop: '100px',
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[100],
}));

const ValidatedInput = () => {
  return (
    <>
      <Typography></Typography>
      <OutlinedInput />
      <Typography></Typography>
    </>
  )
}