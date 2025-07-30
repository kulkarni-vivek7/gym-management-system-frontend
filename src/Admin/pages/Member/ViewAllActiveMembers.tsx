import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import { useAppSelector } from '../../../store/hooks';
import { findAllActiveMembers } from '../../../actions/member/find-all-members';
import type { Member, Membership, Trainer } from '../../../types';
import AddMemberDialog from './AddMemberDialog';
import UpdateMemberDialog from './UpdateMemberDialog';
import ViewAllInactiveMembersDialog from './ViewAllInactiveMembersDialog';
import SearchMembersDialog from './SearchMembersDialog';
import ViewMembershipDetailsDialog from '../ViewMembershipDetailsDialog';
import ViewTrainerDetailsDialog from '../ViewTrainerDetailsDialog';

const ViewAllActiveMembers = () => {
    const [members, setMembers] = useState<Member[] | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalMembers, setTotalMembers] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    // For modal stubs
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isUpdateMemberModalOpen, setIsUpdateMemberModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isViewInactiveMembersModalOpen, setIsViewInactiveMembersModalOpen] = useState(false);
    const [isSearchMembersModalOpen, setIsSearchMembersModalOpen] = useState(false);
    const [isViewMembershipDetailsDialogOpen, setIsViewMembershipDetailsDialogOpen] = useState(false);
    const [isViewTrainerDetailsDialogOpen, setIsViewTrainerDetailsDialogOpen] = useState(false);
    const [selectedMembershipForDialog, setSelectedMembershipForDialog] = useState<Membership | null>(null);
    const [selectedTrainerForDialog, setSelectedTrainerForDialog] = useState<Trainer | null>(null);

    const { jwt } = useAppSelector((state) => state.auth);

    const handleRefreshTrigger = () => {
        setRefreshTrigger(prev => !prev);
    };

    const handleOpenAddMemberModal = () => {
        setIsAddMemberModalOpen(true);
    };
    const handleCloseAddMemberModal = () => {
        setIsAddMemberModalOpen(false);
    };
    const handleOpenUpdateMemberModal = (member: Member) => {
        setSelectedMember(member);
        setIsUpdateMemberModalOpen(true);
    };
    const handleCloseUpdateMemberModal = () => {
        setIsUpdateMemberModalOpen(false);
        setSelectedMember(null);
    };
    const handleOpenViewInactiveMembersModal = () => {
        setIsViewInactiveMembersModalOpen(true);
    };
    const handleCloseViewInactiveMembersModal = () => {
        setIsViewInactiveMembersModalOpen(false);
    };
    const handleOpenSearchMembersModal = () => {
        setIsSearchMembersModalOpen(true);
    };
    const handleCloseSearchMembersModal = () => {
        setIsSearchMembersModalOpen(false);
    };
    const handleOpenMembershipDetailsDialog = (membership: Membership) => {
        setSelectedMembershipForDialog(membership);
        setIsViewMembershipDetailsDialogOpen(true);
    };
    const handleCloseMembershipDetailsDialog = () => {
        setIsViewMembershipDetailsDialogOpen(false);
        setSelectedMembershipForDialog(null);
    };
    const handleOpenTrainerDetailsDialog = (trainer: Trainer) => {
        setSelectedTrainerForDialog(trainer);
        setIsViewTrainerDetailsDialogOpen(true);
    };
    const handleCloseTrainerDetailsDialog = () => {
        setIsViewTrainerDetailsDialogOpen(false);
        setSelectedTrainerForDialog(null);
    };

    const fetchMembers = async () => {
        try {
            const response = await findAllActiveMembers(jwt, page, rowsPerPage);
            setMembers(response.listOfMembers);
            setTotalMembers(response.totalMembers);
        } catch (err) {
            setMembers([]);
            console.error('Failed to fetch members:', err);
        }
    };

    useEffect(() => {
        fetchMembers();
        // eslint-disable-next-line
    }, [page, rowsPerPage, refreshTrigger]);

    return (
        <div className="relative min-h-screen bg-gray-100 pt-15">
            <div
                className="absolute inset-0 bg-cover bg-center filter blur-xs"
                style={{ backgroundImage: 'url(\'/gym_2.jpg\')' }}
            ></div>
            <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-white">All Active Members</h1>

                <Paper sx={{ marginBottom: 4, padding: 1, boxShadow: 3, borderRadius: '0.5rem', backgroundColor: 'white', overflowX: 'auto' }}>
                    <TableContainer sx={{ maxHeight: rowsPerPage !== 5 ? 350 : 'auto', overflowY: rowsPerPage !== 5 ? 'auto' : 'hidden' }}>
                        <Table stickyHeader aria-label="active members table" sx={{ minWidth: '100%' }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e5e7eb' }}>
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
                                {members === null || members === undefined ? (
                                    <TableRow>
                                        <TableCell colSpan={9} sx={{ textAlign: 'center', paddingY: 1.1, color: '#6b7280' }}>
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : members.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} sx={{ textAlign: 'center', paddingY: 1.1, color: '#6b7280' }}>
                                            No active members found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    members.map((member) => (
                                        <TableRow key={member.registerNo || member.memberId} sx={{ borderBottom: '1px solid #e5e7eb', '&:hover': { backgroundColor: '#f9fafb' } }}>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{member.memberId}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{member.name}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{member.email}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{member.phno}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{member.age}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{member.gender}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>
                                                <span
                                                    style={{ fontWeight: 'bold', cursor: member.membership ? 'pointer' : 'default', color: member.membership ? '#dc2626' : undefined }}
                                                    onClick={() => member.membership && handleOpenMembershipDetailsDialog(member.membership)}
                                                >
                                                    {member.membership?.name || '-'}
                                                </span>
                                            </TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>
                                                <span
                                                    style={{ fontWeight: 'bold', cursor: member.trainer ? 'pointer' : 'default', color: member.trainer ? '#dc2626' : undefined }}
                                                    onClick={() => member.trainer && handleOpenTrainerDetailsDialog(member.trainer)}
                                                >
                                                    {member.trainer?.name || '-'}
                                                </span>
                                            </TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>
                                                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full sm:w-auto cursor-pointer" onClick={() => handleOpenUpdateMemberModal(member)}>
                                                    Update
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
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

                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full sm:w-auto cursor-pointer" onClick={handleOpenAddMemberModal}>
                        Add Member
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full sm:w-auto cursor-pointer" onClick={handleOpenViewInactiveMembersModal}>
                        View All Inactive Members
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full sm:w-auto cursor-pointer" onClick={handleOpenSearchMembersModal}>
                        Search Members
                    </button>
                </div>

                <AddMemberDialog
                    open={isAddMemberModalOpen}
                    onClose={handleCloseAddMemberModal}
                    onMemberAdded={fetchMembers}
                />
                {selectedMember && (
                    <UpdateMemberDialog
                        open={isUpdateMemberModalOpen}
                        onClose={handleCloseUpdateMemberModal}
                        onMemberUpdated={fetchMembers}
                        member={selectedMember}
                        isActive={true}
                    />
                )}
                <ViewAllInactiveMembersDialog
                    open={isViewInactiveMembersModalOpen}
                    onClose={handleCloseViewInactiveMembersModal}
                    onRefreshActive={handleRefreshTrigger}
                />
                <SearchMembersDialog
                    open={isSearchMembersModalOpen}
                    onClose={handleCloseSearchMembersModal}
                    onRefreshActive={handleRefreshTrigger}
                />
                <ViewMembershipDetailsDialog
                    open={isViewMembershipDetailsDialogOpen}
                    onClose={handleCloseMembershipDetailsDialog}
                    selectedMembership={selectedMembershipForDialog}
                />
                <ViewTrainerDetailsDialog
                    open={isViewTrainerDetailsDialogOpen}
                    onClose={handleCloseTrainerDetailsDialog}
                    selectedTrainer={selectedTrainerForDialog}
                />
            </div>
        </div>
    );
};

export default ViewAllActiveMembers;
