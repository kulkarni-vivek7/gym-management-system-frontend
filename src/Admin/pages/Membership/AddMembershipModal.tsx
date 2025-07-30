import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, Box, InputBase } from '@mui/material';
import { addMembershipAction, type AddMembershipFormState } from '../../../actions/membership/add-membership-action';
import { useAppSelector } from '../../../store/hooks';

type AddMembershipModalProps = {
    open: boolean;
    onClose: () => void;
    onMembershipAdded: () => void;
}

const AddMembershipModal: React.FC<AddMembershipModalProps> = ({ open, onClose, onMembershipAdded }) => {
    const { jwt } = useAppSelector((state) => state.auth);
    // const [message, setMessage] = React.useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // Form data state
    const [formData, setFormData] = useState({
        name: '',
        duration: '',
        price: '',
    });

    // Form validation state
    const [formState, setFormState] = useState<AddMembershipFormState>({ errors: {} });

    // For showing/hiding success and error messages
    const [visibleErrors, setVisibleErrors] = useState(formState.errors);
    const [showSuccess, setShowSuccess] = useState(false);

    // Disable add button while submitting
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle input change for text fields
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Handle Add Membership submit
    const handleAddMembership = async () => {
        setIsSubmitting(true);

        // Build FormData to send
        const data = new FormData();
        data.append('name', formData.name);
        data.append('duration', formData.duration);
        data.append('price', formData.price);

        const result = await addMembershipAction(jwt, formState, data);
        setFormState(result);

        if (!result.success && result.errors) {
            // Clear only the fields which caused error, keep others intact
            const newFormData = { ...formData };
            if (result.errors.name) newFormData.name = '';
            if (result.errors.duration) newFormData.duration = '';
            if (result.errors.price) newFormData.price = '';
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

    // Auto-hide success message after 2 seconds + close modal
    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                setShowSuccess(false);
                onMembershipAdded();
                onClose();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    return (
        <Dialog open={open} onClose={() => {
            onClose();
            setFormData({ name: '', duration: '', price: '' });
        }} PaperProps={{ sx: { minWidth: { xs: '90%', sm: '400px' }, borderRadius: '0.75rem', boxShadow: 3 } }}>
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.35rem', fontWeight: 'bold', color: '#dc2626' }}>Add Membership</DialogTitle>
            <DialogContent>
                {/* {message && (
                    <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 2, width: '100%' }}>
                        {message.text}
                    </Alert>
                )} */}
                {showSuccess && <Alert severity="success" sx={{ mb: 2, width: '100%' }}>Membership added successfully! Redirecting...</Alert>}

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
                        value={formData.price}
                        onChange={e => handleInputChange('price', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                        sx={{ fontSize: '1rem' }}
                    />
                    {visibleErrors.price && (
                        <p className="text-red-600 text-[13px] ml-1 text-start">{visibleErrors.price[0]}</p>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3, pt: 0, pr: 3, pl: 3 }}>
                <Button
                    type="submit"
                    onClick={handleAddMembership}
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
                    {isSubmitting ? 'Adding...' : 'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddMembershipModal;