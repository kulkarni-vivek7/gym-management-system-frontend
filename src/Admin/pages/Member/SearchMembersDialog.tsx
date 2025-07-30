import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Select, MenuItem, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import { useAppSelector } from '../../../store/hooks';
import { searchMembers } from '../../../actions/member/find-all-members';
import type { Member, Membership, Trainer } from '../../../types';
import UpdateMemberDialog from './UpdateMemberDialog';
import type { SelectChangeEvent } from '@mui/material/Select';
import ViewMembershipDetailsDialog from '../ViewMembershipDetailsDialog';
import ViewTrainerDetailsDialog from '../ViewTrainerDetailsDialog';

interface SearchMembersDialogProps {
    open: boolean;
    onClose: () => void;
    onRefreshActive: () => void;
}

const SearchMembersDialog: React.FC<SearchMembersDialogProps> = ({ open, onClose, onRefreshActive }) => {
    const [searchParam, setSearchParam] = useState<string>('memberId');
    const [searchValue, setSearchValue] = useState<string>('');
    const [members, setMembers] = useState<Member[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalMembers, setTotalMembers] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [isUpdateMemberModalOpen, setIsUpdateMemberModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isViewMembershipDetailsDialogOpen, setIsViewMembershipDetailsDialogOpen] = useState(false);
    const [isViewTrainerDetailsDialogOpen, setIsViewTrainerDetailsDialogOpen] = useState(false);
    const [selectedMembershipForDialog, setSelectedMembershipForDialog] = useState<Membership | null>(null);
    const [selectedTrainerForDialog, setSelectedTrainerForDialog] = useState<Trainer | null>(null);

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

    const searchMembersData = async () => {
        try {
            if (searchValue.trim() === '') {
                setMembers([]);
                setTotalMembers(0);
                return;
            }
            const response = await searchMembers(jwt, searchParam, searchValue, page, rowsPerPage);
            setMembers(response.listOfMembers);
            setTotalMembers(response.totalMembers);
        } catch (err) {
            console.error('Failed to search members:', err);
            setMembers([]);
            setTotalMembers(0);
        }
    };

    useEffect(() => {
        if (open) {
            searchMembersData();
        } else {
            setSearchParam('memberId');
            setSearchValue('');
            setMembers([]);
            setPage(0);
            setRowsPerPage(5);
            setTotalMembers(0);
            setRefreshTrigger(false);
        }
    }, [open, page, rowsPerPage, refreshTrigger]);

    const handleSearchParamChange = (event: SelectChangeEvent, _: React.ReactNode) => {
        setSearchParam(event.target.value as string);
        setSearchValue('');
        setMembers([]);
        setPage(0);
        setTotalMembers(0);
    };

    const handleMemberUpdatedAndRefresh = () => {
        handleRefreshTrigger();
        onRefreshActive();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth PaperProps={{ sx: { borderRadius: '0.75rem', boxShadow: 3 } }}>
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.35rem', fontWeight: 'bold', color: '#dc2626' }}>Search Members</DialogTitle>
            <DialogContent>
                <div className="flex items-center space-x-1 md:space-x-4 mb-4">
                    <Select
                        value={searchParam}
                        onChange={handleSearchParamChange}
                        className='w-full h-10'
                    >
                        <MenuItem value="memberId">Member Id</MenuItem>
                        <MenuItem value="name">Name</MenuItem>
                        <MenuItem value="email">Email</MenuItem>
                        <MenuItem value="trainerId">Trainer Id</MenuItem>
                        <MenuItem value="membershipName">Membership Name</MenuItem>
                    </Select>
                    <InputBase
                        sx={{ flexGrow: 1, border: '1px solid #ccc', borderRadius: '4px', padding: '0 8px' }}
                        className='w-full h-10'
                        placeholder={`Search By Member's ${(searchParam.startsWith('member') && !searchParam.startsWith('membership')) && searchParam.slice('member'.length) || searchParam}`}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        type={searchParam === 'memberId' || searchParam === 'trainerId' ? 'number' : 'text'}
                    />
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full h-10 cursor-pointer" onClick={searchMembersData}>
                        Search
                    </button>
                </div>

                <Paper sx={{ marginBottom: 4, padding: 1, boxShadow: 3, borderRadius: '0.5rem', backgroundColor: 'white', overflowX: 'auto', border: '1px solid #e0e0e0' }}>
                    <TableContainer sx={{ maxHeight: rowsPerPage !== 5 ? 350 : 'auto', overflowY: rowsPerPage !== 5 ? 'auto' : 'hidden' }}>
                        <Table stickyHeader aria-label="search members table" sx={{ minWidth: '100%' }}>
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
                                ) : ( members === null || members === undefined ? (
                                    <TableRow>
                                        <TableCell colSpan={9} sx={{ textAlign: 'center', paddingY: 1.1, color: '#6b7280' }}>
                                            Search for members...
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} sx={{ textAlign: 'center', paddingY: 1.1, color: '#6b7280' }}>
                                            No members found.
                                        </TableCell>
                                    </TableRow>
                                ))
                                }
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
                    isActive={true}
                />
            )}
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
        </Dialog>
    );
};

export default SearchMembersDialog;
