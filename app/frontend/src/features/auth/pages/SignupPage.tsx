import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper } from '@mui/material';
import {
  CoachSignupData,
  signupCoach,
} from '../../../features/auth/services/authService';
import signup from '../../../assets/images/signup.jpg';

const inputFields: InputFieldConfig[] = [
  {
    key: 'firstName',
    label: 'First Name',
    placeholder: 'Enter first name',
    errorText: "First name can't be empty.",
  },
  {
    key: 'lastName',
    label: 'Last Name',
    placeholder: 'Enter last name',
    errorText: "Last name can't be empty.",
  },
  {
    key: 'phone',
    label: 'Phone Number',
    placeholder: '(555) 555-5555',
    errorText: 'Enter a valid phone number.',
  },
  {
    key: 'email',
    label: 'Email',
    placeholder: 'Email',
    errorText: 'Enter a valid email.',
  },
  {
    key: 'password',
    label: 'Password',
    placeholder: 'Password',
    errorText: 'Password must be at least 8 characters.',
    type: 'password',
  },
  {
    key: 'confirmPassword',
    label: 'Confirm Password',
    placeholder: 'Confirm password',
    errorText: 'Passwords must match.',
    type: 'password',
  },
] as const;

type InputFieldConfig = {
  key: keyof typeof initialForm;
  label: string;
  placeholder: string;
  errorText: string;
  type?: 'text' | 'password' | 'email' | 'tel';
};

type ValidatedInputProps = Omit<InputFieldConfig, 'key'> & {
  value: string;
  error: boolean;
  changeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const initialForm = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const initialValid = {
  firstName: false,
  lastName: false,
  phone: false,
  email: false,
  password: false,
  confirmPassword: false,
  all: false,
};

const validateForm = (form: typeof initialForm) => {
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const phoneValid = /^\(\d{3}\) \d{3}-\d{4}$/.test(form.phone);
  const validFirstName = form.firstName !== '';
  const validLastName = form.lastName !== '';
  const passwordValid = form.password.length >= 8;
  const confirmPassword = form.confirmPassword === form.password;

  return {
    email: emailValid,
    phone: phoneValid,
    password: passwordValid,
    confirmPassword: confirmPassword,
    firstName: validFirstName,
    lastName: validLastName,
    all:
      emailValid &&
      phoneValid &&
      passwordValid &&
      confirmPassword &&
      validFirstName &&
      validLastName,
  };
};

const formatPhone = (input: string) => {
  const digitsOnly = input.replace(/\D/g, '');

  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }
  if (digitsOnly.length > 6) {
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }

  return digitsOnly;
};

const SignupPage = () => {
  const [form, setForm] = useState(initialForm);
  const [valid, setValid] = useState(initialValid);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await signupCoach(form as CoachSignupData);
      navigate('/login');
    } catch (error) {
      console.log('Error processing signup: ', error);
    }
  };

  function handleChange(field: keyof typeof form) {
    return function (e: React.ChangeEvent<HTMLInputElement>) {
      const value =
        field === 'phone' ? formatPhone(e.target.value) : e.target.value;
      setForm({ ...form, [field]: value });
    };
  }

  useEffect(() => {
    setValid(validateForm(form));
  }, [form]);

  useEffect(() => {
    const img = new Image();
    img.src = signup;
    img.onload = () => setImageLoaded(true);
  }, []);

  return (
    <>
      {imageLoaded ? (
        <div className="flex h-screen justify-center bg-gray-100 pt-[100px]">
          <div className="flex">
            <img
              src={signup}
              style={{
                height: 750,
                borderTopLeftRadius: 12,
                borderBottomLeftRadius: 12,
              }}
              height={750}
            />
            <Paper
              className="flex h-full flex-col"
              sx={{
                height: '750px',
                width: '500px',
                borderTopLeftRadius: '0px',
                borderBottomLeftRadius: '0px',
                borderTopRightRadius: '12px',
                borderBottomRightRadius: '12px',
                boxShadow: '1',
              }}
            >
              <h2 className="mt-[20px] text-center font-['Nunito'] text-[24px] font-bold">
                Start your ACL Hub account today!
              </h2>
              <div></div>
              <form
                onSubmit={(e) => {
                  console.log('here');
                  e.preventDefault();
                  const newValid = validateForm(form);
                  setValid(newValid);
                  setAttemptedSubmit(true);
                  if (newValid.all) {
                    handleSignup();
                  }
                }}
              >
                <div className="mx-[20px] my-[30px] flex flex-col">
                  <div>
                    {inputFields.map((field) => {
                      return (
                        <ValidatedInput
                          key={field.key}
                          type={field.type}
                          label={field.label}
                          value={form[field.key]}
                          error={attemptedSubmit && !valid[field.key]}
                          errorText={field.errorText}
                          placeholder={field.placeholder}
                          changeHandler={handleChange(field.key)}
                        />
                      );
                    })}
                  </div>

                  <button
                    className="mt-[60px] cursor-pointer rounded-md bg-[#3838c9] p-1 text-lg text-white transition duration-150 hover:bg-blue-500 active:scale-95 active:opacity-90"
                    type="submit"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            </Paper>
          </div>
        </div>
      ) : (
        <> </>
      )}
    </>
  );
};

export default SignupPage;

const ValidatedInput = (props: ValidatedInputProps) => {
  const {
    label,
    error,
    errorText,
    changeHandler,
    placeholder,
    value,
    type = 'text',
  } = props;

  return (
    <div className="text-md mt-[20px] mb-[2px] font-semibold">
      <p>{label}</p>
      <input
        type={type}
        value={value}
        onChange={changeHandler}
        placeholder={placeholder}
        className="w-90 rounded-md border border-gray-300 p-1 text-lg focus:border-blue-400 focus:outline-none"
      />
      <div className="mt-1 h-1">
        {error && <p className="text-sm text-red-400">{errorText}</p>}
      </div>
    </div>
  );
};
