import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Alert } from '@mui/material';
import { useAppSelector } from '../../../store/hooks';
import { findAllInactiveTrainers } from '../../../actions/trainer/find-all-trainers';
import type { Trainer } from '../../../types';
import UpdateTrainerDialog from './UpdateTrainerDialog';
import { deleteUserAction } from '../../../actions/delete-user-action';

// Props for the dialog
interface ViewAllInactiveTrainersDialogProps {
    open: boolean;
    onClose: () => void;
    onRefreshActive: () => void;
}

const ViewAllInactiveTrainersDialog: React.FC<ViewAllInactiveTrainersDialogProps> = ({ open, onClose, onRefreshActive }) => {
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalTrainers, setTotalTrainers] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [isUpdateTrainerModalOpen, setIsUpdateTrainerModalOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

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

    const fetchInactiveTrainers = async () => {
        try {
            const response = await findAllInactiveTrainers(jwt, page, rowsPerPage);
            setTrainers(response.listOfTrainers);
            setTotalTrainers(response.totalTrainers);
        } catch (err) {
            setTrainers([]);
            console.error('Failed to fetch inactive trainers:', err);
        }
    };

    useEffect(() => {
        if (open) {
            fetchInactiveTrainers();
        }
    }, [open, page, rowsPerPage, refreshTrigger]);

    const handleTrainerUpdatedAndRefresh = () => {
        handleRefreshTrigger(); // Refresh inactive trainers table
        onRefreshActive(); // Refresh active trainers table in parent
    };

    const handleDeleteTrainer = async (trainerEmail: string) => {
        try {
            await deleteUserAction(jwt, 'trainer', trainerEmail);
            setMessage({ text: 'Trainer deleted successfully!', type: 'success' });
            setTimeout(() => setMessage(null), 2000);
            handleRefreshTrigger();
            onRefreshActive();
        } catch (error) {
            setMessage({ text: 'Failed to delete trainer.', type: 'error' });
            setTimeout(() => setMessage(null), 3000);
            console.error('Error deleting trainer:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth PaperProps={{ sx: { borderRadius: '0.75rem', boxShadow: 3 } }}>
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.35rem', fontWeight: 'bold', color: '#dc2626' }}>All Inactive Trainers</DialogTitle>
            <DialogContent>
                {message && (
                    <Alert severity={message.type} sx={{ marginBottom: 2 }}>
                        {message.text}
                    </Alert>
                )}
                <Paper sx={{ marginBottom: 4, padding: 1, boxShadow: 3, borderRadius: '0.5rem', backgroundColor: 'white', overflowX: 'auto', border: '1px solid #e0e0e0' }}>
                    <TableContainer sx={{ maxHeight: rowsPerPage !== 5 ? 350 : 'auto', overflowY: rowsPerPage !== 5 ? 'auto' : 'hidden' }}>
                        <Table stickyHeader aria-label="inactive trainers table" sx={{ minWidth: '100%' }}>
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
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{trainer.membership?.name}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>
                                                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full sm:w-auto cursor-pointer" onClick={() => handleOpenUpdateTrainerModal(trainer)}>
                                                    Update
                                                </button>
                                                <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full sm:w-auto cursor-pointer mt-2 sm:mt-0 sm:ml-2" onClick={() => handleDeleteTrainer(trainer.email)}>
                                                    Delete
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} sx={{ textAlign: 'center', paddingY: 1.1, color: '#6b7280' }}>
                                            No inactive trainers found.
                                        </TableCell>
                                    </TableRow>
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
            </DialogContent>
            {selectedTrainer && (
                <UpdateTrainerDialog
                    open={isUpdateTrainerModalOpen}
                    onClose={handleCloseUpdateTrainerModal}
                    onTrainerUpdated={handleTrainerUpdatedAndRefresh}
                    trainer={selectedTrainer}
                    isActive={false}
                />
            )}
        </Dialog>
    );
};

export default ViewAllInactiveTrainersDialog;
