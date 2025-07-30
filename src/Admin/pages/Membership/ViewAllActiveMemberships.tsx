import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import { useAppSelector } from '../../../store/hooks';
import { findAllActiveMemberships } from '../../../actions/membership/find-all-memberships';
import type { Membership } from '../../../types';
import AddMembershipModal from './AddMembershipModal';
import UpdateMembershipModal from './UpdateMembershipModal';
import ViewAllInactiveMembershipsModal from './ViewAllInactiveMembershipsModal';
import SearchMembershipsModal from './SearchMembershipsModal';

const ViewAllActiveMemberships = () => {
    const [memberships, setMemberships] = useState<Membership[] | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalMemberships, setTotalMemberships] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [isAddMembershipModalOpen, setIsAddMembershipModalOpen] = useState(false); // State for modal open/close
    const [isUpdateMembershipModalOpen, setIsUpdateMembershipModalOpen] = useState(false);
    const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
    const [isViewInactiveMembershipsModalOpen, setIsViewInactiveMembershipsModalOpen] = useState(false);
    const [isSearchMembershipsModalOpen, setIsSearchMembershipsModalOpen] = useState(false);

    const { jwt } = useAppSelector((state) => state.auth);

    const handleRefreshTrigger = () => {
        setRefreshTrigger(prev => !prev);
    };

    const handleOpenAddMembershipModal = () => {
        setIsAddMembershipModalOpen(true);
    };

    const handleCloseAddMembershipModal = () => {
        setIsAddMembershipModalOpen(false);
    };

    const handleOpenUpdateMembershipModal = (membership: Membership) => {
        setSelectedMembership(membership);
        setIsUpdateMembershipModalOpen(true);
    };

    const handleCloseUpdateMembershipModal = () => {
        setIsUpdateMembershipModalOpen(false);
        setSelectedMembership(null);
    };

    const handleOpenViewInactiveMembershipsModal = () => {
        setIsViewInactiveMembershipsModalOpen(true);
    };

    const handleCloseViewInactiveMembershipsModal = () => {
        setIsViewInactiveMembershipsModalOpen(false);
    };

    const handleOpenSearchMembershipsModal = () => {
        setIsSearchMembershipsModalOpen(true);
    };

    const handleCloseSearchMembershipsModal = () => {
        setIsSearchMembershipsModalOpen(false);
    };

    const fetchActiveMemberships = async () => {
        try {
            const response = await findAllActiveMemberships(jwt, page, rowsPerPage);
            setMemberships(response.listOfMemberships);
            setTotalMemberships(response.totalMemberships);
        } 
        catch (err) {
            setMemberships([])
            console.error('Failed to fetch memberships:', err);
        }
    };
    useEffect(() => {
        fetchActiveMemberships();
    }, [page, rowsPerPage, refreshTrigger]
    );

    return (
        <div className="relative min-h-screen bg-gray-100 pt-15">
            <div
                className="absolute inset-0 bg-cover bg-center filter blur-xs"
                style={{ backgroundImage: 'url(\'/gym_2.jpg\')' }}
            ></div>
            <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-white">All Active Memberships</h1>

                <Paper sx={{ marginBottom: 4, padding: 1, boxShadow: 3, borderRadius: '0.5rem', backgroundColor: 'white', overflowX: 'auto' }}>
                    <TableContainer sx={{ maxHeight: rowsPerPage !== 5 ? 350 : 'auto', overflowY: rowsPerPage !== 5 ? 'auto' : 'hidden' }}>
                        <Table stickyHeader aria-label="active memberships table" sx={{ minWidth: '100%' }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#e5e7eb' }}>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center', width: { xs: '25%', sm: 'auto' } }}>Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center', width: { xs: '25%', sm: 'auto' } }}>Duration</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center', width: { xs: '25%', sm: 'auto' } }}>Price</TableCell>
                                    <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center', width: { xs: '25%', sm: 'auto' } }}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {memberships === null || memberships === undefined ? (
                                    <TableRow>
                                        <TableCell colSpan={4} sx={{ textAlign: 'center', paddingY: 1.1, color: '#6b7280' }}>
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : memberships.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} sx={{ textAlign: 'center', paddingY: 1.1, color: '#6b7280' }}>
                                            No active memberships found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    memberships.map((membership) => (
                                        <TableRow key={membership.id} sx={{ borderBottom: '1px solid #e5e7eb', '&:hover': { backgroundColor: '#f9fafb' } }}>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{membership.name}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{membership.duration}</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>₹{membership.price}/per month</TableCell>
                                            <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>
                                                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full sm:w-auto cursor-pointer" onClick={() => handleOpenUpdateMembershipModal(membership)}>
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

                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full sm:w-auto cursor-pointer" onClick={handleOpenAddMembershipModal}>
                        Add Membership
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full sm:w-auto cursor-pointer" onClick={handleOpenViewInactiveMembershipsModal}>
                        View All Inactive Memberships
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full sm:w-auto cursor-pointer" onClick={handleOpenSearchMembershipsModal}>
                        Search Memberships
                    </button>
                </div>
            </div>

            <AddMembershipModal
                open={isAddMembershipModalOpen}
                onClose={handleCloseAddMembershipModal}
                onMembershipAdded={fetchActiveMemberships}
            />

            {selectedMembership && (
                <UpdateMembershipModal
                    open={isUpdateMembershipModalOpen}
                    onClose={handleCloseUpdateMembershipModal}
                    onMembershipUpdated={fetchActiveMemberships}
                    membership={selectedMembership}
                    isActive={true}
                />
            )}
            <ViewAllInactiveMembershipsModal
                open={isViewInactiveMembershipsModalOpen}
                onClose={handleCloseViewInactiveMembershipsModal}
                onRefreshActive={handleRefreshTrigger}
            />

            <SearchMembershipsModal
                open={isSearchMembershipsModalOpen}
                onClose={handleCloseSearchMembershipsModal}
                onRefreshActive={handleRefreshTrigger}
            />
        </div>
    );
};

export default ViewAllActiveMemberships;