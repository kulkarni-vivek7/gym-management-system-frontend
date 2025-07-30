
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Select, MenuItem, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import { useAppSelector } from '../../../store/hooks';
import { searchMemberships } from '../../../actions/membership/find-all-memberships';
import type { Membership } from '../../../types';
import UpdateMembershipModal from './UpdateMembershipModal';
import type { SelectChangeEvent } from '@mui/material/Select';

type SearchMembershipsModalProps = {
    open: boolean;
    onClose: () => void;
    onRefreshActive: () => void;
}

const SearchMembershipsModal: React.FC<SearchMembershipsModalProps> = ({ open, onClose, onRefreshActive }) => {
    const [searchParam, setSearchParam] = useState<string>('name');
    const [searchValue, setSearchValue] = useState<string>('');
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalMemberships, setTotalMemberships] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [isUpdateMembershipModalOpen, setIsUpdateMembershipModalOpen] = useState(false);
    const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);

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

    const searchMembershipsData = async () => {
        try {
            if (searchValue.trim() === '') {
                setMemberships([]);
                setTotalMemberships(0);
                return;
            }
            const response = await searchMemberships(jwt, searchParam, searchValue, page, rowsPerPage);
            setMemberships(response.listOfMemberships);
            setTotalMemberships(response.totalMemberships);
        } catch (err) {
            console.error('Failed to search memberships:', err);
            setMemberships([]);
            setTotalMemberships(0);
        }
    };

    useEffect(() => {
        if (open) {
            searchMembershipsData();
        } else {
            // Reset all fields when modal is closed
            setSearchParam('name');
            setSearchValue('');
            setMemberships([]);
            setPage(0);
            setRowsPerPage(5);
            setTotalMemberships(0);
            setRefreshTrigger(false);
        }
    }, [open, page, rowsPerPage, refreshTrigger]);

    const handleSearchParamChange = (event: SelectChangeEvent, _: React.ReactNode) => {
        setSearchParam(event.target.value as string);
        setSearchValue(''); // Reset search value
        setMemberships([]); // Reset memberships table
        setPage(0);
        setTotalMemberships(0);
    };

    const handleMembershipUpdatedAndRefresh = () => {
        handleRefreshTrigger();
        onRefreshActive();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth PaperProps={{ sx: { borderRadius: '0.75rem', boxShadow: 3 } }}>
            <DialogTitle sx={{ textAlign: 'center', fontSize: '1.35rem', fontWeight: 'bold', color: '#dc2626' }}>Search Memberships</DialogTitle>
            <DialogContent>
                <div className="flex items-center space-x-1 md:space-x-4 mb-4">
                    <Select
                        value={searchParam}
                        onChange={handleSearchParamChange}
                        className='w-full h-10'
                    >
                        <MenuItem value="name">Name</MenuItem>
                        <MenuItem value="duration">Duration</MenuItem>
                    </Select>
                    <InputBase
                        sx={{ flexGrow: 1, border: '1px solid #ccc', borderRadius: '4px', padding: '0 8px' }}
                        className='w-full h-10'
                        placeholder={`Search By Membership ${searchParam}`}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out w-full h-10 cursor-pointer" onClick={searchMembershipsData}>
                        Search
                    </button>
                </div>

                <Paper sx={{ marginBottom: 4, padding: 1, boxShadow: 3, borderRadius: '0.5rem', backgroundColor: 'white', overflowX: 'auto', border: '1px solid #e0e0e0' }}>
                    <TableContainer sx={{ maxHeight: rowsPerPage !== 5 ? 350 : 'auto', overflowY: rowsPerPage !== 5 ? 'auto' : 'hidden' }}>
                        <Table stickyHeader aria-label="search memberships table" sx={{ minWidth: '100%' }}>
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
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : ( memberships === null || memberships === undefined ? (
                                    <TableRow>
                                        <TableCell colSpan={4} sx={{ textAlign: 'center', paddingY: 1.1, color: '#6b7280' }}>
                                            Search for memberships...
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} sx={{ textAlign: 'center', paddingY: 1.1, color: '#6b7280' }}>
                                            No memberships found.
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
                    isActive={true}
                />
            )}
        </Dialog>
    );
};

export default SearchMembershipsModal;

