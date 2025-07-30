import { decryptJWT } from '../cryptoUtils';
import type { Trainer } from '../types';
import axios from 'axios';

export const findAllActiveTrainersByMembershipName = async (
    encryptedJWT: string,
    membershipName: string
): Promise<Trainer[]> => {
    try {
        const jwt = decryptJWT(encryptedJWT);
        const response = await axios.get(
            `http://localhost:8080/user/getAllActiveTrainerByMembershipId`,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                params: {
                    membershipName,
                },
            }
        );
        return response.data.body || [];
    } catch (error) {
        console.error('Failed to fetch active trainers by membership name:', error);
        return [];
    }
};
