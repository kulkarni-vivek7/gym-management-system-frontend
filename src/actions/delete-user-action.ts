import { decryptJWT } from "../cryptoUtils";
import axios from 'axios';

export const deleteUserAction = async (encryptedJWT: string, deleteRole: string, deleteValue: string) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;
    try {
        const jwt = decryptJWT(encryptedJWT);

        const response = await axios.delete(`${BACKEND_URL}user/deleteUsers`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            params: {
                deleteRole,
                deleteValue
            }
        });

        return response.data;
    } catch (error: any) {
        console.error('Error in deleteUserAction:', error);
        throw error.response?.data?.message || 'Failed to delete user.';
    }
};
