import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import { useAppSelector } from '../../../store/hooks';
import { findAllActiveTrainers } from '../../../actions/trainer/find-all-trainers';
import type { Trainer } from '../../../types';
import AddTrainerDialog from './AddTrainerDialog';
import UpdateTrainerDialog from './UpdateTrainerDialog';
import ViewAllInactiveTrainersDialog from './ViewAllInactiveTrainersDialog';
import SearchTrainersDialog from './SearchTrainersDialog';
import ViewMembershipDetailsDialog from '../ViewMembershipDetailsDialog';
import type { Membership } from '../../../types';

const ViewAllActiveTrainers = () => {
    const [trainers, setTrainers] = useState<Trainer[] | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalTrainers, setTotalTrainers] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [isAddTrainerModalOpen, setIsAddTrainerModalOpen] = useState(false);
    const [isUpdateTrainerModalOpen, setIsUpdateTrainerModalOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
    const [isViewInactiveTrainersModalOpen, setIsViewInactiveTrainersModalOpen] = useState(false);
    const [isSearchTrainersModalOpen, setIsSearchTrainersModalOpen] = useState(false);
    const [isViewMembershipDetailsDialogOpen, setIsViewMembershipDetailsDialogOpen] = useState(false);
    const [selectedMembershipForDialog, setSelectedMembershipForDialog] = useState<Membership | null>(null);

    const { jwt } = useAppSelector((state) => state.auth);

    const handleRefreshTrigger = () => {
        setRefreshTrigger(prev => !prev);
    };

    const handleOpenAddTrainerModal = () => {
        setIsAddTrainerModalOpen(true);
    };

    const handleCloseAddTrainerModal = () => {
        setIsAddTrainerModalOpen(false);
    };

    const handleOpenUpdateTrainerModal = (trainer: Trainer) => {
        setSelectedTrainer(trainer);
        setIsUpdateTrainerModalOpen(true);
    };

    const handleCloseUpdateTrainerModal = () => {
        setIsUpdateTrainerModalOpen(false);
        setSelectedTrainer(null);
    };

    const handleOpenViewInactiveTrainersModal = () => {
        setIsViewInactiveTrainersModalOpen(true);
    };

    const handleCloseViewInactiveTrainersModal = () => {
        setIsViewInactiveTrainersModalOpen(false);
    };

    const handleOpenSearchTrainersModal = () => {
        setIsSearchTrainersModalOpen(true);
    };

    const handleCloseSearchTrainersModal = () => {
        setIsSearchTrainersModalOpen(false);
    };

    const handleOpenMembershipDetailsDialog = (membership: Membership) => {
        setSelectedMembershipForDialog(membership);
        setIsViewMembershipDetailsDialogOpen(true);
    };
    const handleCloseMembershipDetailsDialog = () => {
        setIsViewMembershipDetailsDialogOpen(false);
        setSelectedMembershipForDialog(null);
    };

    const fetchActiveTrainers = async () => {
        try {
            const response = await findAllActiveTrainers(jwt, page, rowsPerPage);
            setTrainers(response.listOfTrainers);
            setTotalTrainers(response.totalTrainers);
        }
        catch (err) {
            setTrainers([])
            console.error('Failed to fetch trainers:', err);
        }
    };
    useEffect(() => {
        fetchActiveTrainers();
    }, [page, rowsPerPage, refreshTrigger]
    );

    return (
        <div className="relative min-h-screen bg-gray-100 pt-15">
            <div
                className="absolute inset-0 bg-cover bg-center filter blur-xs"
                style={{ backgroundImage: 'url(\'/gym_2.jpg\')' }}
            ></div>
            <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-white">All Active Trainers</h1>

                <Paper sx={{ marginBottom: 4, padding: 1, boxShadow: 3, borderRadius: '0.5rem', backgroundColor: 'white', overflowX: 'auto' }}>
                    <TableContainer sx={{ maxHeight: rowsPerPage !== 5 ? 350 : 'auto', overflowY: rowsPerPage !== 5 ? 'auto' : 'hidden' }}>
                        <Table stickyHeader aria-label="active trainers table" sx={{ minWidth: '100%' }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e5e7eb' }}>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center', width: { xs: '25%', sm: 'auto' } }}>Trainer Id</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center', width: { xs: '25%', sm: 'auto' } }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center', width: { xs: '25%', sm: 'auto' } }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center', width: { xs: '25%', sm: 'auto' } }}>Phone No.</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center', width: { xs: '25%', sm: 'auto' } }}>Age</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center', width: { xs: '25%', sm: 'auto' } }}>Salary</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center', width: { xs: '25%', sm: 'auto' } }}>Gender</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center', width: { xs: '25%', sm: 'auto' } }}>Membership Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center', width: { xs: '25%', sm: 'auto' } }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {trainers === null || trainers === undefined ? (
                                    <TableRow>
                                        <TableCell colSpan={9} sx={{ textAlign: 'center', paddingY: 1.1, color: '#6b7280' }}>
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : trainers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} sx={{ textAlign: 'center', paddingY: 1.1, color: '#6b7280' }}>
                                            No active trainers found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
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
                                )}
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

                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full sm:w-auto cursor-pointer" onClick={handleOpenAddTrainerModal}>
                        Add Trainer
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full sm:w-auto cursor-pointer" onClick={handleOpenViewInactiveTrainersModal}>
                        View All Inactive Trainers
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full sm:w-auto cursor-pointer" onClick={handleOpenSearchTrainersModal}>
                        Search Trainers
                    </button>
                </div>
            </div>

            <AddTrainerDialog
                open={isAddTrainerModalOpen}
                onClose={handleCloseAddTrainerModal}
                onTrainerAdded={fetchActiveTrainers}
            />

            {selectedTrainer && (
                <UpdateTrainerDialog
                    open={isUpdateTrainerModalOpen}
                    onClose={handleCloseUpdateTrainerModal}
                    onTrainerUpdated={fetchActiveTrainers}
                    trainer={selectedTrainer}
                    isActive={true}
                />
            )}
            
            <ViewAllInactiveTrainersDialog
                open={isViewInactiveTrainersModalOpen}
                onClose={handleCloseViewInactiveTrainersModal}
                onRefreshActive={handleRefreshTrigger}
            />

            <SearchTrainersDialog
                open={isSearchTrainersModalOpen}
                onClose={handleCloseSearchTrainersModal}
                onRefreshActive={handleRefreshTrigger}
            />

            <ViewMembershipDetailsDialog
                open={isViewMembershipDetailsDialogOpen}
                onClose={handleCloseMembershipDetailsDialog}
                selectedMembership={selectedMembershipForDialog}
            />
        </div>
    );
};

export default ViewAllActiveTrainers;