import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, Box, InputBase, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { updateMembershipAction, type UpdateMembershipFormState } from '../../../actions/membership/update-membership-action';
import { useAppSelector } from '../../../store/hooks';
import type { Membership } from '../../../types';

type UpdateMembershipModalProps = {
    open: boolean;
    onClose: () => void;
    onMembershipUpdated: () => void;
    isActive: boolean;
    membership: Membership;
}

const UpdateMembershipModal: React.FC<UpdateMembershipModalProps> = ({ open, onClose, onMembershipUpdated, membership, isActive }) => {
    const { jwt } = useAppSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        id: membership.id || 0,
        name: membership.name,
        duration: membership.duration,
        price: membership.price,
        status: membership.status || 'ACTIVE',
    });

    const [formState, setFormState] = useState<UpdateMembershipFormState>({ errors: {} });

    const [visibleErrors, setVisibleErrors] = useState(formState.errors);
    const [showSuccess, setShowSuccess] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormData({
            id: membership.id || 0,
            name: membership.name,
            duration: membership.duration,
            price: membership.price,
            status: membership.status || 'ACTIVE',
        });
        setFormState({ errors: {} });
        setVisibleErrors({});
        setShowSuccess(false);
        setIsSubmitting(false);
    }, [membership]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleUpdateMembership = async () => {
        setIsSubmitting(true);

        const data = new FormData();
        data.append('id', formData.id.toString());
        data.append('name', formData.name);
        data.append('duration', formData.duration);
        data.append('price', formData.price);
        data.append('status', formData.status);

        const result = await updateMembershipAction(jwt, formState, data);
        setFormState(result);

        if (!result.success && result.errors) {
            const newFormData = { ...formData };
            if (result.errors.name) newFormData.name = '';
            if (result.errors.duration) newFormData.duration = '';
            if (result.errors.price) newFormData.price = '';
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
                onMembershipUpdated();
                onClose();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: { minWidth: { xs: '90%', sm: '400px' }, borderRadius: '0.75rem', boxShadow: 3 } }}>
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: 'bold', color: '#dc2626' }}>Update Membership</DialogTitle>
            <DialogContent>
                {showSuccess && <Alert severity="success" sx={{ mb: 2, width: '100%' }}>Membership updated successfully! Redirecting...</Alert>}

                {visibleErrors.formErrors && (
                    <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                        {visibleErrors.formErrors[0]}
                    </Alert>
                )}

                <Box mb={2}>
                    <InputBase
                        autoFocus
                        id="name"
                        name="name"
                        placeholder="Membership Name"
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
                <Box mb={2}>
                    <InputBase
                        id="duration"
                        name="duration"
                        placeholder="Duration (years/months/days)"
                        type="text"
                        fullWidth
                        readOnly={!isActive}
                        value={formData.duration}
                        onChange={e => handleInputChange('duration', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                        sx={{ fontSize: '1rem' }}
                    />
                    {visibleErrors.duration && (
                        <p className="text-red-600 text-[13px] ml-1 text-start">{visibleErrors.duration[0]}</p>
                    )}
                </Box>
                <Box mb={2}>
                    <InputBase
                        id="price"
                        name="price"
                        placeholder="Price (₹)"
                        type="text"
                        fullWidth
                        readOnly={!isActive}
                        value={formData.price}
                        onChange={e => handleInputChange('price', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                        sx={{ fontSize: '1rem' }}
                    />
                    {visibleErrors.price && (
                        <p className="text-red-600 text-[13px] ml-1 text-start">{visibleErrors.price[0]}</p>
                    )}
                </Box>
                <Box>
                    <FormControl fullWidth>
                        <InputLabel id="status-label"
                            sx={{
                                '&.Mui-focused': {
                                    color: 'inherit', // Keep label color consistent with surrounding text
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
                                // Ensure the border color is always gray-300
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#d1d5db', // gray-300
                                },
                                // Keep border color gray-300 on hover
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#d1d5db', // gray-300
                                },
                                // Keep border color gray-300 on focus, and remove default blue shadow/outline
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#d1d5db', // gray-300
                                    boxShadow: 'none', // Remove any default shadow
                                },
                                // Also remove the blue ring often added by Mui on focus directly on the root
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
                    onClick={handleUpdateMembership}
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

export default UpdateMembershipModal;