import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, Box, InputBase, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { updateTrainerAction, type UpdateTrainerFormState } from '../../../actions/trainer/update-trainer-action';
import { useAppSelector } from '../../../store/hooks';
import type { Trainer, Membership } from '../../../types';
import { findAllActiveMembershipsNoLimit } from '../../../actions/find-all-active-memberships-no-limit';

type UpdateTrainerDialogProps = {
    open: boolean;
    onClose: () => void;
    onTrainerUpdated: () => void;
    isActive: boolean;
    trainer: Trainer;
}

const UpdateTrainerDialog: React.FC<UpdateTrainerDialogProps> = ({ open, onClose, onTrainerUpdated, trainer, isActive }) => {
    const { jwt } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        registerNo: trainer.registerNo?.toString() || '',
        trainerId: trainer.trainerId?.toString() || '',
        name: trainer.name,
        age: trainer.age.toString(),
        phno: trainer.phno.toString(),
        email: trainer.email,
        salary: trainer.salary.toString(),
        gender: trainer.gender,
        membershipName: trainer.membership?.name || '',
        originalTrainerEmail: trainer.email, // To send the original email for update
        status: trainer.status || 'ACTIVE',
    });

    const [formState, setFormState] = useState<UpdateTrainerFormState>({ errors: {} });

    const [visibleErrors, setVisibleErrors] = useState(formState.errors);
    const [showSuccess, setShowSuccess] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [memberships, setMemberships] = useState<Membership[]>([]);

    useEffect(() => {
        const fetchMemberships = async () => {
            if (jwt) {
                const activeMemberships = await findAllActiveMembershipsNoLimit(jwt);
                setMemberships(activeMemberships);
            }
        };
        fetchMemberships();
    }, [jwt]);

    useEffect(() => {
        setFormData({
            trainerId: trainer.trainerId?.toString() || '',
            registerNo: trainer.registerNo?.toString() || '',
            name: trainer.name,
            age: trainer.age.toString(),
            phno: trainer.phno.toString(),
            email: trainer.email,
            salary: trainer.salary.toString(),
            gender: trainer.gender,
            membershipName: trainer.membership?.name || '',
            originalTrainerEmail: trainer.email,
            status: trainer.status || 'ACTIVE'
        });
        setFormState({ errors: {} });
        setVisibleErrors({});
        setShowSuccess(false);
        setIsSubmitting(false);
    }, [trainer]);

    const handleInputChange = (field: string, value: string) => {
        if (field === 'phno' || field === 'age' || field === 'salary') {
            const sanitizedValue = value.replace(/[^0-9]/g, '');
            setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleUpdateTrainer = async () => {
        setIsSubmitting(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('age', formData.age);
        data.append('phno', formData.phno);
        data.append('email', formData.email);
        data.append('salary', formData.salary);
        data.append('gender', formData.gender);
        data.append('membershipName', formData.membershipName);
        data.append('originalTrainerEmail', formData.originalTrainerEmail);
        data.append('status', formData.status);
        data.append('trainerId', formData.trainerId);
        data.append('registerNo', formData.registerNo);

        const result = await updateTrainerAction(jwt, formState, data);
        setFormState(result);

        if (!result.success && result.errors) {
            const newFormData = { ...formData };
            if (result.errors.name) newFormData.name = '';
            if (result.errors.age) newFormData.age = '';
            if (result.errors.phno) newFormData.phno = '';
            if (result.errors.email) newFormData.email = '';
            if (result.errors.salary) newFormData.salary = '';
            if (result.errors.gender) newFormData.gender = '';
            if (result.errors.membershipName) newFormData.membershipName = '';
            if (result.errors.status) newFormData.status = '';
            setFormData(newFormData);
            setVisibleErrors(result.errors);
        } else if (result.success) {
            setShowSuccess(true);
            setVisibleErrors({});
        }

        setIsSubmitting(false);
    };

    useEffect(() => {
        if (Object.keys(visibleErrors).length > 0) {
            const timer = setTimeout(() => setVisibleErrors({}), 3000);
            return () => clearTimeout(timer);
        }
    }, [visibleErrors]);

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false);
                onTrainerUpdated();
                onClose();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: { minWidth: { xs: '90%', sm: '400px' }, borderRadius: '0.75rem', boxShadow: 3 } }}>
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: 'bold', color: '#dc2626' }}>Update Trainer</DialogTitle>
            <DialogContent>
                {showSuccess && <Alert severity="success" sx={{ mb: 2, width: '100%' }}>Trainer updated successfully! Redirecting...</Alert>}

                {visibleErrors.formErrors && (
                    <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                        {visibleErrors.formErrors[0]}
                    </Alert>
                )}

                <Box mb={1}>
                    <InputBase
                        autoFocus
                        id="name"
                        name="name"
                        placeholder="Trainer Name"
                        type="text"
                        fullWidth
                        readOnly={!isActive}
                        value={formData.name}
                        onChange={e => handleInputChange('name', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                        sx={{ fontSize: '1rem' }}
                    />
                    {visibleErrors.name && (
                        <p className="text-red-600 text-[13px] ml-1 text-start">{visibleErrors.name[0]}</p>
                    )}
                </Box>
                <Box mb={1}>
                    <InputBase
                        id="age"
                        name="age"
                        placeholder="Age"
                        type="text"
                        fullWidth
                        readOnly={!isActive}
                        value={formData.age}
                        onChange={e => handleInputChange('age', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                        sx={{ fontSize: '1rem' }}
                    />
                    {visibleErrors.age && (
                        <p className="text-red-600 text-[13px] ml-1 text-start">{visibleErrors.age[0]}</p>
                    )}
                </Box>
                <Box mb={1}>
                    <InputBase
                        id="phno"
                        name="phno"
                        placeholder="Phone Number"
                        type="text"
                        fullWidth
                        readOnly={!isActive}
                        value={formData.phno}
                        onChange={e => handleInputChange('phno', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                        inputProps={{ maxLength: 10 }}
                        sx={{ fontSize: '1rem' }}
                    />
                    {visibleErrors.phno && (
                        <p className="text-red-600 text-[13px] ml-1 text-start">{visibleErrors.phno[0]}</p>
                    )}
                </Box>
                <Box mb={1}>
                    <InputBase
                        id="email"
                        name="email"
                        placeholder="Email"
                        type="email"
                        fullWidth
                        readOnly={!isActive}
                        value={formData.email}
                        onChange={e => handleInputChange('email', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                        sx={{ fontSize: '1rem' }}
                    />
                    {visibleErrors.email && (
                        <p className="text-red-600 text-[13px] ml-1 text-start">{visibleErrors.email[0]}</p>
                    )}
                </Box>
                <Box mb={1}>
                    <InputBase
                        id="salary"
                        name="salary"
                        placeholder="Salary (₹)"
                        type="text"
                        fullWidth
                        readOnly={!isActive}
                        value={formData.salary}
                        onChange={e => handleInputChange('salary', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                        sx={{ fontSize: '1rem' }}
                    />
                    {visibleErrors.salary && (
                        <p className="text-red-600 text-[13px] ml-1 text-start">{visibleErrors.salary[0]}</p>
                    )}
                </Box>
                <Box mb={1}>
                    <FormControl fullWidth>
                        <InputLabel id="gender-label"
                            sx={{
                                '&.Mui-focused': {
                                    color: 'inherit',
                                },
                            }}
                        >Gender</InputLabel>
                        <Select
                            labelId="gender-label"
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            label="Gender"
                            readOnly={!isActive}
                            onChange={e => handleInputChange('gender', e.target.value as string)}
                            className="py-2 border border-gray-300 rounded-md"
                            sx={{
                                fontSize: '1rem',
                                height: '50px',
                                border: 'none',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#d1d5db',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#d1d5db',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#d1d5db',
                                    boxShadow: 'none',
                                },
                                '&.Mui-focused': {
                                    outline: 'none',
                                },
                            }}
                        >
                            <MenuItem value="MALE">Male</MenuItem>
                            <MenuItem value="FEMALE">Female</MenuItem>
                            <MenuItem value="OTHERS">Others</MenuItem>
                        </Select>
                    </FormControl>
                    {visibleErrors.gender && (
                        <p className="text-red-600 text-[13px] ml-1 text-start">{visibleErrors.gender[0]}</p>
                    )}
                </Box>
                <Box mb={1}>
                    <FormControl fullWidth>
                        <InputLabel id="membership-label"
                            sx={{
                                '&.Mui-focused': {
                                    color: 'inherit',
                                },
                            }}
                        >Membership</InputLabel>
                        <Select
                            labelId="membership-label"
                            id="membershipName"
                            name="membershipName"
                            value={formData.membershipName}
                            label="Membership"
                            readOnly={!isActive}
                            onChange={e => handleInputChange('membershipName', e.target.value as string)}
                            className="py-2 border border-gray-300 rounded-md"
                            sx={{
                                fontSize: '1rem',
                                height: '50px',
                                border: 'none',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#d1d5db',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#d1d5db',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#d1d5db',
                                    boxShadow: 'none',
                                },
                                '&.Mui-focused': {
                                    outline: 'none',
                                },
                            }}
                        >
                            {memberships.map((membership) => (
                                <MenuItem key={membership.id} value={membership.name}>
                                    {membership.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {visibleErrors.membershipName && (
                        <p className="text-red-600 text-[13px] ml-1 text-start">{visibleErrors.membershipName[0]}</p>
                    )}
                </Box>
                <Box>
                    <FormControl fullWidth>
                        <InputLabel id="status-label"
                            sx={{
                                '&.Mui-focused': {
                                    color: 'inherit',
                                },
                            }}
                        >Status</InputLabel>
                        <Select
                            labelId="status-label"
                            id="status"
                            name="status"
                            value={formData.status}
                            label="Status"
                            onChange={e => handleInputChange('status', e.target.value as string)}
                            className="py-2 border border-gray-300 rounded-md"
                            sx={{
                                fontSize: '1rem',
                                height: '50px',
                                border: 'none',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#d1d5db',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#d1d5db',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#d1d5db',
                                    boxShadow: 'none',
                                },
                                '&.Mui-focused': {
                                    outline: 'none',
                                },
                            }}
                        >
                            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                            <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                        </Select>
                    </FormControl>
                    {visibleErrors.status && (
                        <p className="text-red-600 text-[13px] ml-1 text-start">{visibleErrors.status[0]}</p>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3, pt: 0, pr: 3, pl: 3 }}>
                <Button
                    type="submit"
                    onClick={handleUpdateTrainer}
                    variant="contained"
                    fullWidth
                    sx={{
                        backgroundColor: '#ef4444',
                        '&:hover': { backgroundColor: '#dc2626' },
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        borderRadius: '0.5rem',
                        color: 'white',
                        minWidth: '120px',
                    }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Updating...' : 'Update'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateTrainerDialog;