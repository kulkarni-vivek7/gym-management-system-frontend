import axios from 'axios';
import { decryptJWT } from '../../cryptoUtils';
import type { Trainer } from '../../types';

export async function findTrainerByEmail(email: string, encryptedJwt: string): Promise<Trainer> {
    const jwt = decryptJWT(encryptedJwt);
    if (!jwt) {
        throw new Error('Invalid JWT');
    }
    const url = `http://localhost:8080/trainer/details`;
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