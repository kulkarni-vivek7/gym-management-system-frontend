import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Select, MenuItem, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import { useAppSelector } from '../../../store/hooks';
import { searchTrainers } from '../../../actions/trainer/find-all-trainers';
import type { Trainer } from '../../../types';
import UpdateTrainerDialog from './UpdateTrainerDialog';
import type { SelectChangeEvent } from '@mui/material/Select';
import ViewMembershipDetailsDialog from '../ViewMembershipDetailsDialog';
import type { Membership } from '../../../types';

interface SearchTrainersDialogProps {
    open: boolean;
    onClose: () => void;
    onRefreshActive: () => void;
}

const SearchTrainersDialog: React.FC<SearchTrainersDialogProps> = ({ open, onClose, onRefreshActive }) => {
    const [searchParam, setSearchParam] = useState<string>('trainerId');
    const [searchValue, setSearchValue] = useState<string>('');
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalTrainers, setTotalTrainers] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [isUpdateTrainerModalOpen, setIsUpdateTrainerModalOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
    const [isViewMembershipDetailsDialogOpen, setIsViewMembershipDetailsDialogOpen] = useState(false);
    const [selectedMembershipForDialog, setSelectedMembershipForDialog] = useState<Membership | null>(null);

    const { jwt } = useAppSelector((state) => state.auth);

    const handleRefreshTrigger = () => {
        setRefreshTrigger(prev => !prev);
    };

    const handleOpenUpdateTrainerModal = (trainer: Trainer) => {
        setSelectedTrainer(trainer);
        setIsUpdateTrainerModalOpen(true);
    };

    const handleCloseUpdateTrainerModal = () => {
        setIsUpdateTrainerModalOpen(false);
        setSelectedTrainer(null);
    };

    const handleOpenMembershipDetailsDialog = (membership: Membership) => {
        setSelectedMembershipForDialog(membership);
        setIsViewMembershipDetailsDialogOpen(true);
    };
    const handleCloseMembershipDetailsDialog = () => {
        setIsViewMembershipDetailsDialogOpen(false);
        setSelectedMembershipForDialog(null);
    };

    const searchTrainersData = async () => {
        try {
            if (searchValue.trim() === '') {
                setTrainers([]);
                setTotalTrainers(0);
                return;
            }
            const response = await searchTrainers(jwt, searchParam, searchValue, page, rowsPerPage);
            setTrainers(response.listOfTrainers);
            setTotalTrainers(response.totalTrainers);
        } catch (err) {
            console.error('Failed to search trainers:', err);
            setTrainers([]);
            setTotalTrainers(0);
        }
    };

    useEffect(() => {
        if (open) {
            searchTrainersData();
        } else {
            // Reset all fields when modal is closed
            setSearchParam('trainerId');
            setSearchValue('');
            setTrainers([]);
            setPage(0);
            setRowsPerPage(5);
            setTotalTrainers(0);
            setRefreshTrigger(false);
        }
    }, [open, page, rowsPerPage, refreshTrigger]);

    const handleSearchParamChange = (event: SelectChangeEvent, _: React.ReactNode) => {
        setSearchParam(event.target.value as string);
        setSearchValue(''); // Reset search value
        setTrainers([]); // Reset trainers table
        setPage(0);
        setTotalTrainers(0);
    };

    const handleTrainerUpdatedAndRefresh = () => {
        handleRefreshTrigger();
        onRefreshActive();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth PaperProps={{ sx: { borderRadius: '0.75rem', boxShadow: 3 } }}>
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.35rem', fontWeight: 'bold', color: '#dc2626' }}>Search Trainers</DialogTitle>
            <DialogContent>
                <div className="flex items-center space-x-1 md:space-x-4 mb-4">
                    <Select
                        value={searchParam}
                        onChange={handleSearchParamChange}
                        className='w-full h-10'
                    >
                        <MenuItem value="trainerId">Trainer Id</MenuItem>
                        <MenuItem value="name">Name</MenuItem>
                        <MenuItem value="email">Email</MenuItem>
                        <MenuItem value="membershipName">Membership Name</MenuItem>
                    </Select>
                    <InputBase
                        sx={{ flexGrow: 1, border: '1px solid #ccc', borderRadius: '4px', padding: '0 8px' }}
                        className='w-full h-10'
                        placeholder={`Search By Trainer's ${searchParam.startsWith('trainer') && searchParam.slice('trainer'.length) || searchParam}`}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        type={searchParam === 'trainerId' ? 'number' : 'text'}
                    />
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full h-10 cursor-pointer" onClick={searchTrainersData}>
                        Search
                    </button>
                </div>

                <Paper sx={{ marginBottom: 4, padding: 1, boxShadow: 3, borderRadius: '0.5rem', backgroundColor: 'white', overflowX: 'auto', border: '1px solid #e0e0e0' }}>
                    <TableContainer sx={{ maxHeight: rowsPerPage !== 5 ? 350 : 'auto', overflowY: rowsPerPage !== 5 ? 'auto' : 'hidden' }}>
                        <Table stickyHeader aria-label="search trainers table" sx={{ minWidth: '100%' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Trainer Id</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Phone No.</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Age</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Salary</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Gender</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Membership Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {trainers.length > 0 ? (
                                    trainers.map((trainer) => (
                                        <TableRow key={trainer.registerNo} sx={{ borderBottom: '1px solid #e5e7eb', '&:hover': { backgroundColor: '#f9fafb' } }}>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{trainer.trainerId}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{trainer.name}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{trainer.email}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{trainer.phno}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{trainer.age}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>₹{trainer.salary}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{trainer.gender}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>
                                                <span
                                                    style={{ fontWeight: 'bold', cursor: trainer.membership ? 'pointer' : 'default', color: trainer.membership ? '#dc2626' : undefined }}
                                                    onClick={() => trainer.membership && handleOpenMembershipDetailsDialog(trainer.membership)}
                                                >
                                                    {trainer.membership?.name || '-'}
                                                </span>
                                            </TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>
                                                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full sm:w-auto cursor-pointer" onClick={() => handleOpenUpdateTrainerModal(trainer)}>
                                                    Update
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : ( trainers === null || trainers === undefined ? (
                                    <TableRow>
                                        <TableCell colSpan={9} sx={{ textAlign: 'center', paddingY: 1.1, color: '#6b7280' }}>
                                            Search for trainers...
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} sx={{ textAlign: 'center', paddingY: 1.1, color: '#6b7280' }}>
                                            No trainers found.
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
                        count={totalTrainers}
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

            {selectedTrainer && (
                <UpdateTrainerDialog
                    open={isUpdateTrainerModalOpen}
                    onClose={handleCloseUpdateTrainerModal}
                    onTrainerUpdated={handleTrainerUpdatedAndRefresh}
                    trainer={selectedTrainer}
                    isActive={true}
                />
            )}
            <ViewMembershipDetailsDialog
                open={isViewMembershipDetailsDialogOpen}
                onClose={handleCloseMembershipDetailsDialog}
                selectedMembership={selectedMembershipForDialog}
            />
        </Dialog>
    );
};

export default SearchTrainersDialog;
