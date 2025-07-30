import axios from 'axios';
import { decryptJWT } from '../../cryptoUtils';
import type { Trainer } from '../../types';

export async function findTrainerByEmail(email: string, encryptedJwt: string): Promise<Trainer> {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;
    const jwt = decryptJWT(encryptedJwt);
    if (!jwt) {
        throw new Error('Invalid JWT');
    }
    
    // bug fixed Here: Use BACKEND_URL instead of hardcoded URL
    const url = `${BACKEND_URL}trainer/details`;
    const response = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${jwt}`
        },
        params: {
            email: email
        }
    });
    if (!response.data || !response.data.body) {
        throw new Error('Invalid response from server');
    }
    return response.data.body as Trainer;
}