import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Box, InputBase, Button, IconButton, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { sendOtpAction, type SendOtpFormState } from '../actions/loginAndRegisterActions/send-otp';
import { loginAction, type LoginFormState } from '../actions/loginAndRegisterActions/login';
import { useAppDispatch } from '../store/hooks';
import { setEmailSclice, setJWTSclice } from '../store/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [formState, setFormState] = useState<SendOtpFormState>({ errors: {} });
  const [isSending, setIsSending] = useState(false);
  const [visibleErrors, setVisibleErrors] = useState<{ email?: string[]; formErrors?: string[] }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loginState, setLoginState] = useState<LoginFormState>({ errors: {} });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginVisibleErrors, setLoginVisibleErrors] = useState<{ email?: string[]; otp?: string[]; formErrors?: string[] }>({});
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState<string | null>(null); // <-- Add this line

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setIsSending(true);
    const result = await sendOtpAction(formState, email);
    setFormState(result);
    setIsSending(false);
  };

  // ✅ Show success message for 2 seconds
  useEffect(() => {
    if (formState.success) {
      setShowSuccess(true);
      dispatch(setEmailSclice(email))
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [formState.success]);

  // ✅ Show errors for 3 seconds
  useEffect(() => {
    if (formState.errors) {
      setVisibleErrors(formState.errors);
      const timer = setTimeout(() => {
        setVisibleErrors({});
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [formState.errors]);

  // Handler for login
  const handleLogin = async () => {
    setIsLoggingIn(true);
    setLoginSuccess(null);
    setLoginVisibleErrors({});
    const data = new FormData();
    data.append('email', email);
    data.append('otp', otp);
    const result = await loginAction(loginState, data);
    setLoginState(result);
    if (result.errors && (result.errors.email || result.errors.otp || result.errors.formErrors)) {
      setLoginVisibleErrors(result.errors);
    }
    else if (result.values && result.values.message) {
      setLoginSuccess(result.values.message);
      setEmail('');
      setOtp('');
      // Set JWT in Redux store if present
      if (result.values.jwt) {
        dispatch(setJWTSclice(result.values.jwt));
      }
      // Set redirect path based on role in message (but do not navigate yet)
      const msg = result.values.message;
      if (msg?.startsWith('ADMIN')) {
        setRedirectPath('/admin');
      } else if (msg?.startsWith('TRAINER')) {
        setRedirectPath('/trainer'); // Placeholder, route not yet defined
      } else if (msg?.startsWith('MEMBER')) {
        setRedirectPath('/member'); // Placeholder, route not yet defined
      }
    }
    setIsLoggingIn(false);
  };
  // Auto-hide login errors after 3 seconds
  useEffect(() => {
    if (loginVisibleErrors && (loginVisibleErrors.email || loginVisibleErrors.otp || loginVisibleErrors.formErrors)) {
      const timer = setTimeout(() => setLoginVisibleErrors({}), 3000);
      return () => clearTimeout(timer);
    }
  }, [loginVisibleErrors]);
  // Auto-hide login success after 2 seconds and redirect if needed
  useEffect(() => {
    if (loginSuccess) {
      const timer = setTimeout(() => {
        setLoginSuccess(null);
        if (redirectPath) {
          navigate(redirectPath);
          setRedirectPath(null); // Reset after navigation
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loginSuccess, redirectPath, navigate]);

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/gym_1.jpg')` }}
    >
      <Box className="w-[90%] max-w-md bg-white bg-opacity-95 shadow-2xl rounded-xl px-6 py-8 sm:px-8 sm:py-10 flex flex-col gap-2">
        {/* OTP Sending Message */}
        {isSending && (
          <p className="text-center text-sm text-blue-600 font-semibold mb-1">
            Sending OTP...
          </p>
        )}

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-red-600 mb-3">Login</h2>

        {/* Success Message */}
        {showSuccess && <Alert severity="success">OTP sent successfully</Alert>}

        {/* Form error */}
        {visibleErrors.formErrors && (
          // <p className="text-red-600 text-sm mt-1 ml-1"></p>
          <Alert severity="error">{visibleErrors.formErrors[0]}</Alert>
        )}
        {/* Email Input + Send Icon */}
        <Box className="flex items-center border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-red-500">
          <InputBase
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSending}
            fullWidth
            className="px-3 py-2 text-sm sm:text-base"
            sx={{ flex: 1 }}
          />
          <IconButton
            onClick={handleSendOtp}
            disabled={isSending}
            sx={{ color: 'red', mr: 1 }}
          >
            <SendIcon />
          </IconButton>
        </Box>

        {/* Email validation error while sending otp */}
        {visibleErrors.email && (
          // <p className="text-red-600 text-sm ml-1 text-start">{visibleErrors.email[0]}</p>
          <Alert severity="error" className='h-8 flex items-center'>{visibleErrors.email[0]}</Alert>
        )}

        {/* Email validation error while login */}
        {loginVisibleErrors.email && (
          <Alert severity="error" className='h-8 flex items-center'>{loginVisibleErrors.email[0]}</Alert>
        )}

        {/* OTP Input */}
        <Box className="flex items-center border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-red-500 mt-2">
          <InputBase
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => {
              // Allow only digits and max 6 characters
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setOtp(value);
            }}
            disabled={!formState.success || isSending}
            fullWidth
            className="px-3 py-2 text-sm sm:text-base"
            sx={{ flex: 1 }}
            inputProps={{ maxLength: 6 }}
          />
        </Box>
        
        {/* OTP validation error while login */}
        {loginVisibleErrors.otp && (
          <Alert severity="error" className='h-8 flex items-center'>{loginVisibleErrors.otp[0]}</Alert>
        )}

        {/* Login Button */}
        <Button
          fullWidth
          variant="contained"
          disabled={!formState.success || isSending || isLoggingIn}
          onClick={handleLogin}
          sx={{
            backgroundColor: '#ef4444',
            '&:hover': { backgroundColor: '#dc2626' },
            py: 1.5,
            fontWeight: 'bold',
            fontSize: '0.95rem',
            borderRadius: '0.5rem',
            mt: 2,
          }}
        >
          {isLoggingIn ? 'Logging in...' : 'Login'}
        </Button>

        {/* Login Success Message */}
        {loginSuccess && <Alert severity="success">{loginSuccess}</Alert>}
        {/* Login Error Messages */}
        {loginVisibleErrors.formErrors && (
          <Alert severity="error">{loginVisibleErrors.formErrors[0]}</Alert>
        )}

        {/* Divider */}
        <div className="flex items-center gap-2 text-gray-400 text-sm sm:text-base mt-4">
          <div className="flex-grow border-t border-gray-300" />
          or
          <div className="flex-grow border-t border-gray-300" />
        </div>

        {/* Register Link */}
        <p className="text-center text-gray-700 text-sm sm:text-base">
          Don&apos;t have an account?{' '}
          <NavLink to="/register" className="text-red-600 font-medium hover:underline">
            Register Here
          </NavLink>
        </p>
      </Box>
    </div>
  );
};

export default Login;
