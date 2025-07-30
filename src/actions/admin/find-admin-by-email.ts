import axios from 'axios';
import { decryptJWT } from '../../cryptoUtils';
import type { Admin } from '../../types';

export async function findAdminByEmail(email: string, encryptedJwt: string): Promise<Admin> {
    const jwt = decryptJWT(encryptedJwt);
    if (!jwt) {
        throw new Error('Invalid JWT');
    }
    const url = `http://localhost:8080/user/getAdminDetails`;
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
    return response.data.body as Admin;
}
