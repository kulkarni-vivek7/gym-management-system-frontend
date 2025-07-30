import { useEffect, useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { findMemberByEmail } from '../../actions/member/find-member-by-email';
import type { Member } from '../../types';
import { setNameSclice } from '../../store/authSlice';

const MemberHomePage = () => {
  const email = useAppSelector((state) => state.auth.email);
  const encryptedJwt = useAppSelector((state) => state.auth.jwt);
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!email || !encryptedJwt) {
          setError('Missing authentication details. Please login again.');
          setLoading(false);
          return;
        }
        const data = await findMemberByEmail(email, encryptedJwt);
        setMember(data);
        dispatch(setNameSclice(data.name));
      } catch (err: any) {
        setError(err.message || 'Failed to fetch member details');
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [email, encryptedJwt]);

  return (
    <div className="min-h-screen w-screen relative flex items-center justify-center pt-15 overflow-hidden">
      {/* Background Image with Blur */}
      <img
        src="/gym_4.jpg"
        alt="Gym Background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'blur(4px)' }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 w-full h-full" />
      {/* Content Box */}
      <Box className="w-[90%] max-w-lg bg-white bg-opacity-95 shadow-2xl rounded-xl px-6 py-8 sm:px-8 sm:py-10 flex flex-col gap-6 items-center z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-red-600 mb-4">Member Details</h2>
        {loading ? (
          <CircularProgress color="primary" />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : member ? (
          <div className="w-full overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <tbody>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left font-semibold w-1/3">Name</th>
                  <td className="py-2 px-4">{member.name}</td>
                </tr>
                <tr>
                  <th className="py-2 px-4 text-left font-semibold">Email</th>
                  <td className="py-2 px-4">{member.email}</td>
                </tr>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left font-semibold">Phone</th>
                  <td className="py-2 px-4">{member.phno}</td>
                </tr>
                <tr>
                  <th className="py-2 px-4 text-left font-semibold">Age</th>
                  <td className="py-2 px-4">{member.age}</td>
                </tr>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left font-semibold">Gender</th>
                  <td className="py-2 px-4">{member.gender}</td>
                </tr>
                <tr>
                  <th className="py-2 px-4 text-left font-semibold">Trainer</th>
                  <td className="py-2 px-4">{member.trainer?.name || '-'}</td>
                </tr>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 text-left font-semibold">Membership</th>
                  <td className="py-2 px-4">{member.membership?.name || '-'}</td>
                </tr>
                <tr>
                  <th className="py-2 px-4 text-left font-semibold">Status</th>
                  <td className="py-2 px-4">{member.status}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </Box>
    </div>
  );
};

export default MemberHomePage;