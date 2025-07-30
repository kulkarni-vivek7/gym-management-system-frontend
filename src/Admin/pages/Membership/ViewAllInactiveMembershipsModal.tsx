import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Alert } from '@mui/material';
import { useAppSelector } from '../../../store/hooks';
import { findAllInactiveMemberships } from '../../../actions/membership/find-all-memberships';
import type { Membership } from '../../../types';
import UpdateMembershipModal from './UpdateMembershipModal';
import { deleteUserAction } from '../../../actions/delete-user-action';

type ViewAllInactiveMembershipsModalProps = {
    open: boolean;
    onClose: () => void;
    onRefreshActive: () => void;
}

const ViewAllInactiveMembershipsModal: React.FC<ViewAllInactiveMembershipsModalProps> = ({ open, onClose, onRefreshActive }) => {
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalMemberships, setTotalMemberships] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [isUpdateMembershipModalOpen, setIsUpdateMembershipModalOpen] = useState(false);
    const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const { jwt } = useAppSelector((state) => state.auth);

    const handleRefreshTrigger = () => {
        setRefreshTrigger(prev => !prev);
    };

    const handleOpenUpdateMembershipModal = (membership: Membership) => {
        setSelectedMembership(membership);
        setIsUpdateMembershipModalOpen(true);
    };

    const handleCloseUpdateMembershipModal = () => {
        setIsUpdateMembershipModalOpen(false);
        setSelectedMembership(null);
    };

    const fetchInactiveMemberships = async () => {
        try {
            const response = await findAllInactiveMemberships(jwt, page, rowsPerPage);
            setMemberships(response.listOfMemberships);
            setTotalMemberships(response.totalMemberships);
        } catch (err) {
            console.error('Failed to fetch inactive memberships:', err);
        }
    };

    useEffect(() => {
        if (open) {
            fetchInactiveMemberships();
        }
    }, [open, page, rowsPerPage, refreshTrigger]);

    const handleMembershipUpdatedAndRefresh = () => {
        handleRefreshTrigger(); // Refresh inactive memberships table
        onRefreshActive(); // Refresh active memberships table in parent
    };

    const handleDeleteMembership = async (membershipName: string) => {
        try {
            await deleteUserAction(jwt, 'membership', membershipName);
            setMessage({ text: 'Membership deleted successfully!', type: 'success' });
            setTimeout(() => setMessage(null), 2000);
            handleRefreshTrigger();
            onRefreshActive();
        } catch (error) {
            setMessage({ text: 'Failed to delete membership.', type: 'error' });
            setTimeout(() => setMessage(null), 3000);
            console.error('Error deleting membership:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth PaperProps={{ sx: { borderRadius: '0.75rem', boxShadow: 3 } }}>
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.35rem', fontWeight: 'bold', color: '#dc2626' }}>All Inactive Memberships</DialogTitle>
            <DialogContent>
                {message && (
                    <Alert severity={message.type} sx={{ marginBottom: 2 }}>
                        {message.text}
                    </Alert>
                )}
                <Paper sx={{ marginBottom: 4, padding: 1, boxShadow: 3, borderRadius: '0.5rem', backgroundColor: 'white', overflowX: 'auto', border: '1px solid #e0e0e0' }}>
                    <TableContainer sx={{ maxHeight: rowsPerPage !== 5 ? 350 : 'auto', overflowY: rowsPerPage !== 5 ? 'auto' : 'hidden' }}>
                        <Table stickyHeader aria-label="inactive memberships table" sx={{ minWidth: '100%' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center', width: { xs: '25%', sm: 'auto' } }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center', width: { xs: '25%', sm: 'auto' } }}>Duration</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center', width: { xs: '25%', sm: 'auto' } }}>Price</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center', width: { xs: '25%', sm: 'auto' } }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {memberships.length > 0 ? (
                                    memberships.map((membership) => (
                                        <TableRow key={membership.id} sx={{ borderBottom: '1px solid #e5e7eb', '&:hover': { backgroundColor: '#f9fafb' } }}>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{membership.name}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{membership.duration}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>₹{membership.price}/per month</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>
                                                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full sm:w-auto cursor-pointer" onClick={() => handleOpenUpdateMembershipModal(membership)}>
                                                    Update
                                                </button>
                                                <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full sm:w-auto cursor-pointer mt-2 sm:mt-0 sm:ml-2" onClick={() => handleDeleteMembership(membership.name)}>
                                                    Delete
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} sx={{ textAlign: 'center', paddingY: 1.1, color: '#6b7280' }}>
                                            No inactive memberships found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15, 20]}
                        component="div"
                        count={totalMemberships}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(_: unknown, newPage: number) => {
                            setPage(newPage);
                        }}
                        onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            setRowsPerPage(parseInt(event.target.value, 10));
                            setPage(0);
                        }}
                        sx={{ marginTop: 1 }}
                    />
                </Paper>
            </DialogContent>
            
            {selectedMembership && (
                <UpdateMembershipModal
                    open={isUpdateMembershipModalOpen}
                    onClose={handleCloseUpdateMembershipModal}
                    onMembershipUpdated={handleMembershipUpdatedAndRefresh}
                    membership={selectedMembership}
                    isActive={false}
                />
            )}
        </Dialog>
    );
};

export default ViewAllInactiveMembershipsModal;