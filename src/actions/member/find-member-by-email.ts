import axios from 'axios';
import { decryptJWT } from '../../cryptoUtils';
import type { Member } from '../../types';

export async function findMemberByEmail(email: string, encryptedJwt: string): Promise<Member> {
    const jwt = decryptJWT(encryptedJwt);
    if (!jwt) {
        throw new Error('Invalid JWT');
    }
    const url = `http://localhost:8080/member/details`;
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
    return response.data.body as Member;
}
