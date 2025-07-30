import { decryptJWT } from '../cryptoUtils';
import type { Membership } from '../types';
import axios from 'axios';

export const findAllActiveMembershipsNoLimit = async (encryptedJWT: string): Promise<Membership[]> => {

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

    try {
        const jwt = decryptJWT(encryptedJWT);

        // bug fixed Here: Use BACKEND_URL instead of hardcoded URL
        const response = await axios.get(`${BACKEND_URL}user/getAllActiveMembershipsNoLimit`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });

        return response.data.body || [];
    } catch (error) {
        console.error('Failed to fetch all active memberships:', error);
        return [];
    }
};
