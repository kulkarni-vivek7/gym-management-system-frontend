import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, Box, InputBase, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { addMemberAction, type AddMemberFormState } from '../../../actions/member/add-member-action';
import { useAppSelector } from '../../../store/hooks';
import { findAllActiveMembershipsNoLimit } from '../../../actions/find-all-active-memberships-no-limit';
import { findAllActiveTrainersByMembershipName } from '../../../actions/find-all-active-trainers-no-limit';
import type { Membership, Trainer } from '../../../types';

type AddMemberDialogProps = {
    open: boolean;
    onClose: () => void;
    onMemberAdded: () => void;
}

const AddMemberDialog: React.FC<AddMemberDialogProps> = ({ open, onClose, onMemberAdded }) => {
    const { jwt } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        phno: '',
        email: '',
        gender: '',
        membershipName: '',
        trainerId: '',
    });

    const [formState, setFormState] = useState<AddMemberFormState>({ errors: {} });
    const [visibleErrors, setVisibleErrors] = useState(formState.errors);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [trainers, setTrainers] = useState<Trainer[]>([]);

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
        const fetchTrainers = async () => {
            if (jwt && formData.membershipName) {
                const activeTrainers = await findAllActiveTrainersByMembershipName(jwt, formData.membershipName);
                setTrainers(activeTrainers);
            } else {
                setTrainers([]);
            }
        };
        fetchTrainers();
    }, [jwt, formData.membershipName]);

    const handleInputChange = (field: string, value: string) => {
        if (field === 'phno') {
            const sanitizedValue = value.replace(/[^0-9]/g, '');
            setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleAddMember = async () => {
        setIsSubmitting(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('age', formData.age);
        data.append('phno', formData.phno);
        data.append('email', formData.email);
        data.append('gender', formData.gender);
        data.append('membershipName', formData.membershipName);
        data.append('trainerId', formData.trainerId);

        const result = await addMemberAction(jwt, formState, data);
        setFormState(result);

        if (!result.success && result.errors) {
            const newFormData = { ...formData };
            if (result.errors.name) newFormData.name = '';
            if (result.errors.age) newFormData.age = '';
            if (result.errors.phno) newFormData.phno = '';
            if (result.errors.email) newFormData.email = '';
            if (result.errors.gender) newFormData.gender = '';
            if (result.errors.membershipName) newFormData.membershipName = '';
            if (result.errors.trainerId) newFormData.trainerId = '';
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
                gender: '',
                membershipName: '',
                trainerId: '',
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
                onMemberAdded();
                onClose();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    return (
        <Dialog open={open} onClose={() => {
            onClose();
            setFormData({ name: '', age: '', phno: '', email: '', gender: '', membershipName: '', trainerId: '' });
            setFormState({ errors: {} });
            setVisibleErrors({});
            setShowSuccess(false);
        }} PaperProps={{ sx: { minWidth: { xs: '90%', sm: '400px' }, borderRadius: '0.75rem', boxShadow: 3 } }}>
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.35rem', fontWeight: 'bold', color: '#dc2626' }}>Add Member</DialogTitle>
            <DialogContent>
                {showSuccess && <Alert severity="success" sx={{ mb: 2, width: '100%' }}>Member added successfully! Redirecting...</Alert>}

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
                        placeholder="Member Name"
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
                        sx={{ fontSize: '1rem', height: '2.5rem' }}
                    />
                    {Array.isArray(visibleErrors.age) && visibleErrors.age.length > 0 && (
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
                        sx={{ fontSize: '1rem', height: '2.5rem' }}
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
                        sx={{ fontSize: '1rem', height: '2.5rem' }}
                    />
                    {visibleErrors.email && (
                        <p className="text-red-600 text-[13px] ml-1 text-start">{visibleErrors.email[0]}</p>
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
                            sx={{ fontSize: '1rem', height: '2.5rem' }}
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
                <Box mb={1.5}>
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
                            sx={{ fontSize: '1rem', height: '2.5rem' }}
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
                <Box mb={1.5}>
                    <FormControl fullWidth>
                        <InputLabel id="trainer-label">Trainer</InputLabel>
                        <Select
                            labelId="trainer-label"
                            id="trainerId"
                            name="trainerId"
                            value={formData.trainerId}
                            label="Trainer"
                            onChange={e => handleInputChange('trainerId', e.target.value as string)}
                            className="py-2 border border-gray-300 rounded-md"
                            sx={{ fontSize: '1rem', height: '2.5rem' }}
                            disabled={!formData.membershipName || trainers.length === 0}
                        >
                            {trainers.length === 0 ? (
                                <MenuItem value="">No trainers available</MenuItem>
                            ) : (
                                trainers.map((trainer) => (
                                    <MenuItem key={trainer.trainerId} value={trainer.trainerId?.toString() || ''}>
                                        {trainer.name}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>
                    {visibleErrors.trainerId && (
                        <p className="text-red-600 text-[13px] ml-1 text-start">{visibleErrors.trainerId[0]}</p>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3, pt: 0, pr: 3, pl: 3 }}>
                <Button
                    type="submit"
                    onClick={handleAddMember}
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
                    {isSubmitting ? 'Adding...' : 'Add Member'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddMemberDialog;
