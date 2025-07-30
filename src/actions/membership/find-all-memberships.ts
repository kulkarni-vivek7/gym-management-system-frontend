
import { decryptJWT } from '../../cryptoUtils';
import type { Membership } from '../../types';
import axios from 'axios';

type FetchMembershipsResponse = {
    listOfMemberships: Membership[];
    totalMemberships: number;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export const findAllActiveMemberships = async (encryptedJWT: string, page: number, limit: number): Promise<FetchMembershipsResponse> => {


    try {
        const jwt = decryptJWT(encryptedJWT);

        const response = await axios.get(`${BACKEND_URL}user/viewAllMemberships`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            params: {
                searchParam: 'memberships',
                searchValue: 'active',
                page: page,
                limit: limit,
            },
        });

        const listOfMemberships: Membership[] = response.data.body?.content || [];
        const totalMemberships: number = response.data.body?.totalElements || 0;

        return {
            listOfMemberships,
            totalMemberships,
        };
    } catch (error) {
        console.error('Failed to fetch active memberships:', error);
        return {
            listOfMemberships: [],
            totalMemberships: 0,
        };
    }
};

export const findAllInactiveMemberships = async (encryptedJWT: string, page: number, limit: number): Promise<FetchMembershipsResponse> => {
    try {
        const jwt = decryptJWT(encryptedJWT);

        const response = await axios.get(`${BACKEND_URL}user/viewAllMemberships`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            params: {
                searchParam: 'memberships',
                searchValue: 'inactive',
                page: page,
                limit: limit,
            },
        });

        const listOfMemberships: Membership[] = response.data.body?.content || [];
        const totalMemberships: number = response.data.body?.totalElements || 0;

        return {
            listOfMemberships,
            totalMemberships,
        };
    } catch (error) {
        console.error('Failed to fetch inactive memberships:', error);
        return {
            listOfMemberships: [],
            totalMemberships: 0,
        };
    }
};

export const searchMemberships = async (encryptedJWT: string, searchParam: string, searchValue: string, page: number, limit: number): Promise<FetchMembershipsResponse> => {
    try {
        const jwt = decryptJWT(encryptedJWT);

        const response = await axios.get(`${BACKEND_URL}user/viewAllMemberships`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            params: {
                searchParam: searchParam,
                searchValue: searchValue,
                page: page,
                limit: limit,
            },
        });

        let listOfMemberships: Membership[] = [];
        const totalMemberships: number = response.data.body?.totalElements || 1;

        if (searchParam === 'name') {
            listOfMemberships = Array.from([response.data.body]);
        } else {
            listOfMemberships = response.data.body?.content || [];
        }

        return {
            listOfMemberships,
            totalMemberships,
        };
    } catch (error) {
        console.error(`Failed to search memberships by ${searchParam}:`, error);
        return {
            listOfMemberships: [],
            totalMemberships: 0,
        };
    }
};

