import { decryptJWT } from '../../cryptoUtils';
import type { Member } from '../../types';
import axios from 'axios';

type FetchMembersResponse = {
    listOfMembers: Member[];
    totalMembers: number;
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export const findAllActiveMembers = async (encryptedJWT: string, page: number, limit: number): Promise<FetchMembersResponse> => {
    try {
        const jwt = decryptJWT(encryptedJWT);

        // bug fixed Here: Use BACKEND_URL instead of hardcoded URL
        const response = await axios.get(`${BACKEND_URL}user/viewAllMembers`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            params: {
                searchParam: 'members',
                searchValue: 'active',
                limit: limit,
                page: page,
            },
        });
        const listOfMembers: Member[] = response.data.body?.content || [];
        const totalMembers: number = response.data.body?.totalElements || 0;
        return {
            listOfMembers,
            totalMembers,
        };
    } catch (error) {
        console.error('Failed to fetch active members:', error);
        return {
            listOfMembers: [],
            totalMembers: 0,
        };
    }
};

export const findAllInactiveMembers = async (encryptedJWT: string, page: number, limit: number): Promise<FetchMembersResponse> => {
    try {
        const jwt = decryptJWT(encryptedJWT);

        // bug fixed Here: Use BACKEND_URL instead of hardcoded URL
        const response = await axios.get(`${BACKEND_URL}user/viewAllMembers`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            params: {
                searchParam: 'members',
                searchValue: 'inactive',
                page: page,
                limit: limit,
            },
        });
        const listOfMembers: Member[] = response.data.body?.content || [];
        const totalMembers: number = response.data.body?.totalElements || 0;
        return {
            listOfMembers,
            totalMembers,
        };
    } catch (error) {
        console.error('Failed to fetch inactive members:', error);
        return {
            listOfMembers: [],
            totalMembers: 0,
        };
    }
};

export const searchMembers = async (encryptedJWT: string, searchParam: string, searchValue: string, page: number, limit: number): Promise<FetchMembersResponse> => {
    try {
        const jwt = decryptJWT(encryptedJWT);

        // bug fixed Here: Use BACKEND_URL instead of hardcoded URL
        const response = await axios.get(`${BACKEND_URL}user/viewAllMembers`, {
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
        let listOfMembers: Member[] = [];
        const totalMembers: number = response.data.body?.totalElements || 1;

        if (searchParam === 'memberId' || searchParam === 'email') {
            listOfMembers = Array.from([response.data.body]);
        } else {
            listOfMembers = response.data.body?.content || [];
        }
        return {
            listOfMembers,
            totalMembers,
        };
    } catch (error) {
        console.error(`Failed to search members by ${searchParam}:`, error);
        return {
            listOfMembers: [],
            totalMembers: 0,
        };
    }
};
