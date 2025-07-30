import { decryptJWT } from '../cryptoUtils';
import type { Membership } from '../types';
import axios from 'axios';

export const findAllActiveMembershipsNoLimit = async (encryptedJWT: string): Promise<Membership[]> => {
    try {
        const jwt = decryptJWT(encryptedJWT);

        const response = await axios.get('http://localhost:8080/user/getAllActiveMembershipsNoLimit', {
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
