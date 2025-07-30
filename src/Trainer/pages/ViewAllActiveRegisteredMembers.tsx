import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import { getAllRegisteredMembers } from '../../actions/trainer/find-all-trainers';
import type { Member } from '../../types';

const ViewAllActiveRegisteredMembers = () => {
  const trainerEmail = useAppSelector((state) => state.auth.email);
  const jwt = useAppSelector((state) => state.auth.jwt);
  const [members, setMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalMembers, setTotalMembers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllRegisteredMembers(jwt, trainerEmail, page, rowsPerPage);
      setMembers(response.listOfMembers);
      setTotalMembers(response.totalMembers);
      if (response.error) setError(response.error);
    } catch (err: any) {
      setMembers([]);
      setTotalMembers(0);
      setError(err.message || 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [page, rowsPerPage, trainerEmail, jwt]);

  return (
    <div className="relative min-h-screen bg-gray-100 pt-15">
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-xs"
        style={{ backgroundImage: 'url("/gym_3.jpg")' }}
      ></div>
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">All Registered Members</h1>
        <Paper sx={{ marginBottom: 4, padding: 1, boxShadow: 3, borderRadius: '0.5rem', backgroundColor: 'white', overflowX: 'auto' }}>
          <TableContainer sx={{ maxHeight: rowsPerPage !== 5 ? 350 : 'auto', overflowY: rowsPerPage !== 5 ? 'auto' : 'hidden' }}>
            <Table stickyHeader aria-label="registered members table" sx={{ minWidth: '100%' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#e5e7eb' }}>
                  <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Member Id</TableCell>
                  <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Phone No.</TableCell>
                  <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Age</TableCell>
                  <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Gender</TableCell>
                  <TableCell sx={{ fontWeight: 'semibold', color: '#4b5563', paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>Membership Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', paddingY: 1.1, color: '#6b7280' }}>
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', paddingY: 1.1, color: '#dc2626' }}>
                      No Registered Members Found
                    </TableCell>
                  </TableRow>
                ) : members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', paddingY: 1.1, color: '#6b7280' }}>
                      No registered members found.
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
                      <TableCell sx={{ paddingY: 1.1, paddingX: 2, textAlign: 'center' }}>{member.membership?.name || '-'}</TableCell>
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
      </div>
    </div>
  );
};

export default ViewAllActiveRegisteredMembers;