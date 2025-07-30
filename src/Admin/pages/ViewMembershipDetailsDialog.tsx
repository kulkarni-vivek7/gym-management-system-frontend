import React from 'react';
import { Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import type { Membership } from '../../types';

interface ViewMembershipDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    selectedMembership: Membership | null;
}

const ViewMembershipDetailsDialog: React.FC<ViewMembershipDetailsDialogProps> = ({ open, onClose, selectedMembership }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '0.75rem', boxShadow: 3 } }}>
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.35rem', fontWeight: 'bold', color: '#dc2626' }}>Membership Details</DialogTitle>
            <DialogContent>
                <Paper sx={{ marginBottom: 4, padding: 1, boxShadow: 3, borderRadius: '0.5rem', backgroundColor: 'white', overflowX: 'auto' }}>
                    <TableContainer>
                        <Table aria-label="membership details table" sx={{ minWidth: '100%' }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e5e7eb' }}>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', textAlign: 'center' }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', textAlign: 'center' }}>Duration</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', textAlign: 'center' }}>Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedMembership ? (
                                    <TableRow>
                                        <TableCell sx={{ textAlign: 'center' }}>{selectedMembership.name}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{selectedMembership.duration}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>₹{selectedMembership.price}/per month</TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} sx={{ textAlign: 'center', color: '#6b7280' }}>
                                            No membership selected.
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

export default ViewMembershipDetailsDialog;
