import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, Box, InputBase, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { addTrainerAction, type AddTrainerFormState } from '../../../actions/trainer/add-trainer-action';
import { useAppSelector } from '../../../store/hooks';
import { findAllActiveMembershipsNoLimit } from '../../../actions/find-all-active-memberships-no-limit';
import type { Membership } from '../../../types';

type AddTrainerDialogProps = {
    open: boolean;
    onClose: () => void;
    onTrainerAdded: () => void;
}

const AddTrainerDialog: React.FC<AddTrainerDialogProps> = ({ open, onClose, onTrainerAdded }) => {
    const { jwt } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        phno: '',
        email: '',
        salary: '',
        gender: '',
        membershipName: '',
    });

    const [formState, setFormState] = useState<AddTrainerFormState>({ errors: {} });
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

    const handleInputChange = (field: string, value: string) => {
        if (field === 'phno') {
            const sanitizedValue = value.replace(/[^0-9]/g, '');
            setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleAddTrainer = async () => {
        setIsSubmitting(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('age', formData.age);
        data.append('phno', formData.phno);
        data.append('email', formData.email);
        data.append('salary', formData.salary);
        data.append('gender', formData.gender);
        data.append('membershipName', formData.membershipName);

        const result = await addTrainerAction(jwt, formState, data);
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
            setFormData(newFormData);
            setVisibleErrors(result.errors);
        } else if (result.success) {
            setShowSuccess(true);
            setVisibleErrors({});
            setFormData({
                name: '',
                age: '',
                phno: '',
                email: '',
                salary: '',
                gender: '',
                membershipName: '',
            });
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
                onTrainerAdded();
                onClose();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    return (
        <Dialog open={open} onClose={() => {
            onClose();
            setFormData({ name: '', age: '', phno: '', email: '', salary: '', gender: '', membershipName: '' });
            setFormState({ errors: {} });
            setVisibleErrors({});
            setShowSuccess(false);
        }} PaperProps={{ sx: { minWidth: { xs: '90%', sm: '400px' }, borderRadius: '0.75rem', boxShadow: 3 } }}>
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.35rem', fontWeight: 'bold', color: '#dc2626' }}>Add Trainer</DialogTitle>
            <DialogContent>
                {showSuccess && <Alert severity="success" sx={{ mb: 2, width: '100%' }}>Trainer added successfully! Redirecting...</Alert>}

                {visibleErrors.formErrors && (
                    <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                        {visibleErrors.formErrors[0]}
                    </Alert>
                )}

                <Box mb={1.5}>
                    <InputBase
                        autoFocus
                        id="name"
                        name="name"
                        placeholder="Trainer Name"
                        type="text"
                        fullWidth
                        value={formData.name}
                        onChange={e => handleInputChange('name', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                        sx={{ fontSize: '1rem', height: '2.5rem' }}
                    />
                    {visibleErrors.name && (
                        <p className="text-red-600 text-[13px] ml-1 text-start">{visibleErrors.name[0]}</p>
                    )}
                </Box>
                <Box mb={1.5}>
                    <InputBase
                        id="age"
                        name="age"
                        placeholder="Age"
                        type="text"
                        fullWidth
                        value={formData.age}
                        onChange={e => handleInputChange('age', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                        sx={{ fontSize: '1rem', height: '2.5rem'}}
                    />
                    {visibleErrors.age && (
                        <p className="text-red-600 text-[13px] ml-1 text-start">{visibleErrors.age[0]}</p>
                    )}
                </Box>
                <Box mb={1.5}>
                    <InputBase
                        id="phno"
                        name="phno"
                        placeholder="Phone Number"
                        type="text"
                        fullWidth
                        value={formData.phno}
                        onChange={e => handleInputChange('phno', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                        inputProps={{ maxLength: 10 }}
                        sx={{ fontSize: '1rem', height: '2.5rem'}}
                    />
                    {visibleErrors.phno && (
                        <p className="text-red-600 text-[13px] ml-1 text-start">{visibleErrors.phno[0]}</p>
                    )}
                </Box>
                <Box mb={1.5}>
                    <InputBase
                        id="email"
                        name="email"
                        placeholder="Email"
                        type="email"
                        fullWidth
                        value={formData.email}
                        onChange={e => handleInputChange('email', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                        sx={{ fontSize: '1rem', height: '2.5rem'}}
                    />
                    {visibleErrors.email && (
                        <p className="text-red-600 text-[13px] ml-1 text-start">{visibleErrors.email[0]}</p>
                    )}
                </Box>
                <Box mb={1.5}>
                    <InputBase
                        id="salary"
                        name="salary"
                        placeholder="Salary (₹)"
                        type="text"
                        fullWidth
                        value={formData.salary}
                        onChange={e => handleInputChange('salary', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                        sx={{ fontSize: '1rem', height: '2.5rem'}}
                    />
                    {visibleErrors.salary && (
                        <p className="text-red-600 text-[13px] ml-1 text-start">{visibleErrors.salary[0]}</p>
                    )}
                </Box>
                <Box mb={1.5}>
                    <FormControl fullWidth>
                        <InputLabel id="gender-label">Gender</InputLabel>
                        <Select
                            labelId="gender-label"
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            label="Gender"
                            onChange={e => handleInputChange('gender', e.target.value as string)}
                            className="py-2 border border-gray-300 rounded-md"
                            sx={{ fontSize: '1rem', height: '2.5rem'}}
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
                <Box>
                    <FormControl fullWidth>
                        <InputLabel id="membership-label">Membership</InputLabel>
                        <Select
                            labelId="membership-label"
                            id="membershipName"
                            name="membershipName"
                            value={formData.membershipName}
                            label="Membership"
                            onChange={e => handleInputChange('membershipName', e.target.value as string)}
                            className="py-2 border border-gray-300 rounded-md"
                            sx={{ fontSize: '1rem', height: '2.5rem'}}
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
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3, pt: 0, pr: 3, pl: 3 }}>
                <Button
                    type="submit"
                    onClick={handleAddTrainer}
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
                    {isSubmitting ? 'Adding...' : 'Add Trainer'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddTrainerDialog;