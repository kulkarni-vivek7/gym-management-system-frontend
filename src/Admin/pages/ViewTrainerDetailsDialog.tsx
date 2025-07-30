import React from 'react';
import { Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import type { Trainer } from '../../types';

interface ViewTrainerDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    selectedTrainer: Trainer | null;
}

const ViewTrainerDetailsDialog: React.FC<ViewTrainerDetailsDialogProps> = ({ open, onClose, selectedTrainer }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: '0.75rem', boxShadow: 3 } }}>
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.35rem', fontWeight: 'bold', color: '#dc2626' }}>Trainer Details</DialogTitle>
            <DialogContent>
                <Paper sx={{ marginBottom: 4, padding: 1, boxShadow: 3, borderRadius: '0.5rem', backgroundColor: 'white', overflowX: 'auto' }}>
                    <TableContainer>
                        <Table aria-label="trainer details table" sx={{ minWidth: '100%' }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e5e7eb' }}>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', textAlign: 'center' }}>Trainer Id</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', textAlign: 'center' }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', textAlign: 'center' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', textAlign: 'center' }}>Phone No.</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', textAlign: 'center' }}>Age</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', textAlign: 'center' }}>Salary</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', textAlign: 'center' }}>Gender</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', textAlign: 'center' }}>Membership Name</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedTrainer ? (
                                    <TableRow>
                                        <TableCell sx={{ textAlign: 'center' }}>{selectedTrainer.trainerId}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{selectedTrainer.name}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{selectedTrainer.email}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{selectedTrainer.phno}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{selectedTrainer.age}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>₹{selectedTrainer.salary}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{selectedTrainer.gender}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{selectedTrainer.membership?.name || '-'}</TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} sx={{ textAlign: 'center', color: '#6b7280' }}>
                                            No trainer selected.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </DialogContent>
        </Dialog>
    );
};

export default ViewTrainerDetailsDialog;
