import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Alert, IconButton, Modal, InputBase, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { findAdminByEmail } from '../../actions/admin/find-admin-by-email';
import { setNameSclice, clearAuth } from '../../store/authSlice';
import type { Admin } from '../../types';
import { updateAdminAction, type UpdateAdminFormState } from '../../actions/admin/update-admin-action';

const AdminHomePage = () => {
  const navigate = useNavigate();
  const email = useAppSelector((state) => state.auth.email);
  const encryptedJwt = useAppSelector((state) => state.auth.jwt);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Admin | null>(null);
  const [formState, setFormState] = useState<UpdateAdminFormState>({ errors: {} });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showEmailUpdateMessage, setShowEmailUpdateMessage] = useState(false);
  const [showInactiveMessage, setShowInactiveMessage] = useState(false);
  const [visibleErrors, setVisibleErrors] = useState(formState.errors);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!email || !encryptedJwt) {
          setError('Missing authentication details. Please login again.');
          setLoading(false);
          return;
        }
        const data = await findAdminByEmail(email, encryptedJwt);
        setAdmin(data);
        dispatch(setNameSclice(data.name));
      } catch (err: any) {
        setError(err.message || 'Failed to fetch admin details');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [email, encryptedJwt]);

  useEffect(() => {
    if (admin) {
      setFormData(admin);
    }
  }, [admin]);

  useEffect(() => {
    if (Object.keys(formState.errors).length > 0) {
      setVisibleErrors(formState.errors);
      const timer = setTimeout(() => setVisibleErrors({}), 3000);
      return () => clearTimeout(timer);
    }
  }, [formState.errors]);

  const handleInputChange = (field: keyof Admin, value: string) => {
    if (!formData) return;
    setFormData(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const handleUpdate = async () => {
    if (!formData || !encryptedJwt) return;
    setIsSubmitting(true);
    const originalEmail = admin?.email;
    const originalStatus = admin?.status;
    
    const result = await updateAdminAction(formState, formData,  originalEmail as string, encryptedJwt);
    setFormState(result);

    if (result.success) {
      if (formData?.email !== originalEmail) {
        setShowEmailUpdateMessage(true);
        setAdmin(formData); // Update local admin state for rendering
        setTimeout(() => {
          setShowEmailUpdateMessage(false);
          dispatch(clearAuth());
          navigate('/');
        }, 2000);
      } else if (formData.status === 'INACTIVE' && originalStatus !== 'INACTIVE') {
        setShowInactiveMessage(true);
        setAdmin(formData); // Update local admin state for rendering
        setTimeout(() => {
          setShowInactiveMessage(false);
          dispatch(clearAuth());
          navigate('/');
        }, 2000);
      } else {
        setShowUpdateSuccess(true);
        setAdmin(formData);
        setTimeout(() => {
          setShowUpdateSuccess(false);
          setModalOpen(false);
        }, 2000);
      }
    } else {
      // If update fails, re-open the modal and show errors
      setModalOpen(true);
      // Ensure the form data is reset to the current admin data if there was an error and partial changes were made
      if (admin) {
        setFormData(admin);
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div
      className="min-h-screen w-screen relative flex items-center justify-center pt-15 overflow-hidden"
    >
      {/* Background Image with Blur */}
      <img
        src="/gym_2.jpg"
        alt="Gym Background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'blur(4px)' }}
      />

      {/* Blue Overlay */}
      <div
        className="absolute inset-0 w-full h-full"
      ></div>

      {/* Content Box */}
      <Box className="w-[90%] max-w-lg bg-white bg-opacity-95 shadow-2xl rounded-xl px-6 py-8 sm:px-8 sm:py-10 flex flex-col gap-6 items-center z-10">
        <div className="w-full flex items-center justify-between mb-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-red-600">Admin Details</h2>
          <IconButton aria-label="edit" onClick={() => setModalOpen(true)}>
            <EditIcon color="error" />
          </IconButton>
        </div>
        {loading ? (
          <CircularProgress color="error" />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : admin ? (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <tbody>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left font-semibold w-1/3">Name</th>
                  <td className="py-2 px-4">{admin.name}</td>
                </tr>
                <tr>
                  <th className="py-2 px-4 text-left font-semibold">Email</th>
                  <td className="py-2 px-4">{admin.email}</td>
                </tr>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left font-semibold">Phone</th>
                  <td className="py-2 px-4">{admin.phno}</td>
                </tr>
                <tr>
                  <th className="py-2 px-4 text-left font-semibold">Age</th>
                  <td className="py-2 px-4">{admin.age}</td>
                </tr>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left font-semibold">Gender</th>
                  <td className="py-2 px-4">{admin.gender}</td>
                </tr>
                <tr>
                  <th className="py-2 px-4 text-left font-semibold">Status</th>
                  <td className="py-2 px-4">{admin.status}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </Box>
      
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-8 flex flex-col gap-3 overflow-y-auto">
          <h2 className="text-2xl font-bold text-center text-red-600 mb-4">Update admin</h2>
          {showEmailUpdateMessage && (
            <Alert severity="error">Your Email is Updated, Login Again With New Email Id</Alert>
          )}
          {showInactiveMessage && (
            <Alert severity="error">Admin Is Inactive, Cannot Able to Login Again</Alert>
          )}
          {showUpdateSuccess && !showEmailUpdateMessage && !showInactiveMessage && (
            <Alert severity="success">Admin updated successfully!</Alert>
          )}
          {!showEmailUpdateMessage && !showInactiveMessage && !showUpdateSuccess && (
            <>
              <InputBase
                placeholder="Name"
                value={formData?.name || ''}
                onChange={e => handleInputChange('name', e.target.value)}
                fullWidth
                className="px-3 py-2 border border-gray-300 rounded-md"
                sx={{ fontSize: '1rem' }}
              />
              {visibleErrors.name && (
                <p className="text-red-600 text-[13px] ml-1">{visibleErrors.name[0]}</p>
              )}
              <InputBase
                placeholder="Age"
                value={formData?.age || ''}
                onChange={e => handleInputChange('age', e.target.value)}
                fullWidth
                type="number"
                className="px-3 py-2 border border-gray-300 rounded-md"
                sx={{ fontSize: '1rem' }}
              />
              {visibleErrors.age && (
                <p className="text-red-600 text-[13px] ml-1">{visibleErrors.age[0]}</p>
              )}
              <InputBase
                placeholder="Email"
                value={formData?.email || ''}
                onChange={e => handleInputChange('email', e.target.value)}
                fullWidth
                className="px-3 py-2 border border-gray-300 rounded-md"
                sx={{ fontSize: '1rem' }}
              />
              {visibleErrors.email && (
                <p className="text-red-600 text-[13px] ml-1">{visibleErrors.email[0]}</p>
              )}
              <InputBase
                placeholder="Phone Number"
                value={formData?.phno || ''}
                onChange={e => {
                  const filteredValue = e.target.value.replace(/\D/g, '');
                  handleInputChange('phno', filteredValue);
                }}
                fullWidth
                className="px-3 py-2 border border-gray-300 rounded-md"
                sx={{ fontSize: '1rem' }}
                inputProps={{ maxLength: 10 }}
              />
              {visibleErrors.phno && (
                <p className="text-red-600 text-[13px] ml-1">{visibleErrors.phno[0]}</p>
              )}
              <FormControl fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  value={formData?.gender || ''}
                  label="Gender"
                  onChange={e => handleInputChange('gender', e.target.value)}
                  className="border border-gray-300 rounded-md"
                  sx={{ fontSize: '1rem', textAlign: 'left' }}
                >
                  <MenuItem value="MALE" sx={{ textAlign: 'left' }}>MALE</MenuItem>
                  <MenuItem value="FEMALE" sx={{ textAlign: 'left' }}>FEMALE</MenuItem>
                  <MenuItem value="OTHERS" sx={{ textAlign: 'left' }}>OTHERS</MenuItem>
                </Select>
              </FormControl>
              {visibleErrors.gender && (
                <p className="text-red-600 text-[13px] ml-1">{visibleErrors.gender[0]}</p>
              )}
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  value={formData?.status || ''}
                  label="Status"
                  onChange={e => handleInputChange('status', e.target.value)}
                  className="border border-gray-300 rounded-md"
                  sx={{ fontSize: '1rem', textAlign: 'left' }}
                >
                  <MenuItem value="ACTIVE" sx={{ textAlign: 'left' }}>ACTIVE</MenuItem>
                  <MenuItem value="INACTIVE" sx={{ textAlign: 'left' }}>INACTIVE</MenuItem>
                </Select>
              </FormControl>
              {visibleErrors.status && (
                <p className="text-red-600 text-[13px] ml-1">{visibleErrors.status[0]}</p>
              )}
              {visibleErrors.formErrors && (
                <p className="text-red-600 text-[13px] ml-1">{visibleErrors.formErrors[0]}</p>
              )}
              <Button
                fullWidth
                variant="contained"
                onClick={handleUpdate}
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
                Update
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default AdminHomePage;
