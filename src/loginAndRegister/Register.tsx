import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Box, InputBase, Button, Select, MenuItem, Alert, FormControl, InputLabel } from '@mui/material';
import { registerAction, type RegisterFormState } from '../actions/loginAndRegisterActions/register';

const Register = () => {
  const navigate = useNavigate();


  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phno: '',
    gender: '',
  });

  // Form validation state
  const [formState, setFormState] = useState<RegisterFormState>({ errors: {} });

  // For showing/hiding success and error messages
  const [visibleErrors, setVisibleErrors] = useState(formState.errors);
  const [showSuccess, setShowSuccess] = useState(false);

  // Disable register button while submitting
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change for text, number, and select
  const handleInputChange = (field: string, value: string) => {
    // For phone: restrict input to numbers and max 10 digits
    if (field === 'phno') {
      if (/^\d{0,10}$/.test(value)) {
        setFormData(prev => ({ ...prev, [field]: value }));
      }
    } else if (field === 'age') {
      // Allow only numbers for age
      if (/^\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, [field]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  // Handle register submit
  const handleRegister = async () => {
    setIsSubmitting(true);

    // Build FormData to send
    const data = new FormData();
    data.append('name', formData.name);
    data.append('age', formData.age);
    data.append('email', formData.email);
    data.append('phno', formData.phno);
    data.append('gender', formData.gender);

    const result = await registerAction(formState, data);
    setFormState(result);

    if (!result.success && result.errors) {
      // Clear only the fields which caused error, keep others intact
      const newFormData = { ...formData };
      if (result.errors.name) newFormData.name = '';
      if (result.errors.age) newFormData.age = '';
      if (result.errors.email) newFormData.email = '';
      if (result.errors.phno) newFormData.phno = '';
      if (result.errors.gender) newFormData.gender = '';
      setFormData(newFormData);
      setVisibleErrors(result.errors);
    } else if (result.success) {
      setShowSuccess(true);
      setVisibleErrors({});
    }

    setIsSubmitting(false);
  };

  // Auto-hide error messages after 3 seconds
  useEffect(() => {
    if (Object.keys(visibleErrors).length > 0) {

      const timer = setTimeout(() => setVisibleErrors({}), 3000);

      return () => clearTimeout(timer);
    }
  }, [visibleErrors]);

  // Auto-hide success message after 2 seconds + redirect to login page
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        navigate('/');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/gym_1.jpg')` }}
    >
      <Box className="w-[90%] max-w-md bg-white bg-opacity-95 shadow-2xl rounded-xl px-6 py-8 sm:px-8 sm:py-10 flex flex-col gap-3">
        {/* Login link */}
        <Box className="w-full px-3 flex justify-start">
          <NavLink to="/" className="text-[16px] text-red-600 hover:underline">
            ← Login
          </NavLink>
        </Box>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-red-600 mb-4">Admin Register</h2>

        {/* Success message */}
        {showSuccess && <Alert severity="success">Registration successful! Redirecting...</Alert>}

        {/* Form error general message */}
        {visibleErrors.formErrors && (
          <Alert severity="error">
            {visibleErrors.formErrors[0]}
          </Alert>
        )}

        {/* Name input */}
        <Box>
          <InputBase
            placeholder="Name"
            value={formData.name}
            onChange={e => handleInputChange('name', e.target.value)}
            fullWidth
            className="px-3 py-2 border border-gray-300 rounded-md"
            sx={{ fontSize: '1rem' }}
          />
          {visibleErrors.name && (
            <p className="text-red-600 text-[13px] ml-1 text-start">{visibleErrors.name[0]}</p>
          )}
        </Box>

        {/* Age input */}
        <Box>
          <InputBase
            placeholder="Age"
            value={formData.age}
            onChange={e => handleInputChange('age', e.target.value)}
            fullWidth
            type="number"
            className="px-3 py-2 border border-gray-300 rounded-md"
            sx={{ fontSize: '1rem' }}
          />
          {visibleErrors.age && (
            <p className="text-red-600 text-[13px] ml-1 text-start">{visibleErrors.age[0]}</p>
          )}
        </Box>

        {/* Email input */}
        <Box>
          <InputBase
            placeholder="Email"
            value={formData.email}
            onChange={e => handleInputChange('email', e.target.value)}
            fullWidth
            className="px-3 py-2 border border-gray-300 rounded-md"
            sx={{ fontSize: '1rem' }}
          />
          {visibleErrors.email && (
            <p className="text-red-600 text-[13px] ml-1">{visibleErrors.email[0]}</p>
          )}
        </Box>

        {/* Phone input */}
        <Box>
          <InputBase
            placeholder="Phone Number"
            value={formData.phno}
            onChange={e => handleInputChange('phno', e.target.value)}
            fullWidth
            className="px-3 py-2 border border-gray-300 rounded-md"
            sx={{ fontSize: '1rem' }}
            inputProps={{ maxLength: 10 }}
          />
          {visibleErrors.phno && (
            <p className="text-red-600 text-[13px] ml-1">{visibleErrors.phno[0]}</p>
          )}
        </Box>

        {/* Gender select */}
        <Box>
          <FormControl fullWidth>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              value={formData.gender}
              label="Gender"
              onChange={e => handleInputChange('gender', e.target.value)}
              className="border border-gray-300 rounded-md"
              sx={{
                fontSize: '1rem',
                textAlign: 'left', // ensures left-alignment of selected value
              }}
            >
              <MenuItem value="MALE" sx={{ textAlign: 'left' }}>MALE</MenuItem>
              <MenuItem value="FEMALE" sx={{ textAlign: 'left' }}>FEMALE</MenuItem>
              <MenuItem value="OTHERS" sx={{ textAlign: 'left' }}>OTHERS</MenuItem>
            </Select>
          </FormControl>
          {visibleErrors.gender && (
            <p className="text-red-600 text-[13px] ml-1">{visibleErrors.gender[0]}</p>
          )}
        </Box>

        {/* Register button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleRegister}
          disabled={isSubmitting}
          sx={{
            backgroundColor: '#ef4444',
            '&:hover': { backgroundColor: '#dc2626' },
            py: 1.5,
            fontWeight: 'bold',
            fontSize: '1rem',
            borderRadius: '0.5rem',
            mt: 2,
          }}
        >
          Register
        </Button>
      </Box>
    </div>
  );
};

export default Register;
