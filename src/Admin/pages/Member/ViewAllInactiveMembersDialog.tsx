import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Alert } from '@mui/material';
import { useAppSelector } from '../../../store/hooks';
import { findAllInactiveMembers } from '../../../actions/member/find-all-members';
import type { Member } from '../../../types';
import UpdateMemberDialog from './UpdateMemberDialog';
import { deleteUserAction } from '../../../actions/delete-user-action';

interface ViewAllInactiveMembersDialogProps {
    open: boolean;
    onClose: () => void;
    onRefreshActive: () => void;
}

const ViewAllInactiveMembersDialog: React.FC<ViewAllInactiveMembersDialogProps> = ({ open, onClose, onRefreshActive }) => {
    const [members, setMembers] = useState<Member[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalMembers, setTotalMembers] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [isUpdateMemberModalOpen, setIsUpdateMemberModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const { jwt } = useAppSelector((state) => state.auth);

    const handleRefreshTrigger = () => {
        setRefreshTrigger(prev => !prev);
    };

    const handleOpenUpdateMemberModal = (member: Member) => {
        setSelectedMember(member);
        setIsUpdateMemberModalOpen(true);
    };

    const handleCloseUpdateMemberModal = () => {
        setIsUpdateMemberModalOpen(false);
        setSelectedMember(null);
    };

    const handleDeleteMember = async (memberEmail: string) => {
        try {
            await deleteUserAction(jwt, 'member', memberEmail);
            setMessage({ text: 'Member deleted successfully!', type: 'success' });
            setTimeout(() => setMessage(null), 2000);
            handleRefreshTrigger();
            onRefreshActive();
        } catch (error) {
            setMessage({ text: 'Failed to delete member.', type: 'error' });
            setTimeout(() => setMessage(null), 3000);
            console.error('Error deleting member:', error);
        }
    };

    const fetchInactiveMembers = async () => {
        try {
            const response = await findAllInactiveMembers(jwt, page, rowsPerPage);
            setMembers(response.listOfMembers);
            setTotalMembers(response.totalMembers);
        } catch (err) {
            setMembers([]);
            console.error('Failed to fetch inactive members:', err);
        }
    };

    useEffect(() => {
        if (open) {
            fetchInactiveMembers();
        }
    }, [open, page, rowsPerPage, refreshTrigger]);

    const handleMemberUpdatedAndRefresh = () => {
        handleRefreshTrigger(); // Refresh inactive members table
        onRefreshActive(); // Refresh active members table in parent
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth PaperProps={{ sx: { borderRadius: '0.75rem', boxShadow: 3 } }}>
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.35rem', fontWeight: 'bold', color: '#dc2626' }}>All Inactive Members</DialogTitle>
            <DialogContent>
                {message && (
                    <Alert severity={message.type} sx={{ marginBottom: 2 }}>
                        {message.text}
                    </Alert>
                )}
                <Paper sx={{ marginBottom: 4, padding: 1, boxShadow: 3, borderRadius: '0.5rem', backgroundColor: 'white', overflowX: 'auto', border: '1px solid #e0e0e0' }}>
                    <TableContainer sx={{ maxHeight: rowsPerPage !== 5 ? 350 : 'auto', overflowY: rowsPerPage !== 5 ? 'auto' : 'hidden' }}>
                        <Table stickyHeader aria-label="inactive members table" sx={{ minWidth: '100%' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Member Id</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Phone No.</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Age</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Gender</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Membership Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Trainer Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {members.length > 0 ? (
                                    members.map((member) => (
                                        <TableRow key={member.registerNo || member.memberId} sx={{ borderBottom: '1px solid #e5e7eb', '&:hover': { backgroundColor: '#f9fafb' } }}>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{member.memberId}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{member.name}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{member.email}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{member.phno}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{member.age}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{member.gender}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{member.membership?.name || '-'}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{member.trainer?.name || '-'}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>
                                                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full sm:w-auto cursor-pointer" onClick={() => handleOpenUpdateMemberModal(member)}>
                                                    Update
                                                </button>
                                                <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full sm:w-auto cursor-pointer mt-2 sm:mt-0 sm:ml-2" onClick={() => handleDeleteMember(member.email)}>
                                                    Delete
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} sx={{ textAlign: 'center', paddingY: 1.1, color: '#6b7280' }}>
                                            No inactive members found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15, 20]}
                        component="div"
                        count={totalMembers}
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
            {selectedMember && (
                <UpdateMemberDialog
                    open={isUpdateMemberModalOpen}
                    onClose={handleCloseUpdateMemberModal}
                    onMemberUpdated={handleMemberUpdatedAndRefresh}
                    member={selectedMember}
                    isActive={false}
                />
            )}
        </Dialog>
    );
};

export default ViewAllInactiveMembersDialog;
