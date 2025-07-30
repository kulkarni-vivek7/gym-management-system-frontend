import { decryptJWT } from '../../cryptoUtils';
import type { Trainer, Member } from '../../types';
import axios from 'axios';

type FetchTrainersResponse = {
    listOfTrainers: Trainer[];
    totalTrainers: number;
}
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export const findAllActiveTrainers = async (encryptedJWT: string, page: number, limit: number): Promise<FetchTrainersResponse> => {

    try {
        const jwt = decryptJWT(encryptedJWT);

        const response = await axios.get(`${BACKEND_URL}user/viewAllTrainers`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            params: {
                searchParam: 'trainers',
                searchValue: 'active',
                limit: limit,
                page: page
            },
        });

        const listOfTrainers: Trainer[] = response.data.body?.content || [];
        const totalTrainers: number = response.data.body?.totalElements || 0;

        return {
            listOfTrainers,
            totalTrainers,
        };
    } catch (error) {
        console.error('Failed to fetch active trainers:', error);
        return {
            listOfTrainers: [],
            totalTrainers: 0,
        };
    }
};

export const findAllInactiveTrainers = async (encryptedJWT: string, page: number, limit: number): Promise<FetchTrainersResponse> => {
    try {
        const jwt = decryptJWT(encryptedJWT);

        const response = await axios.get(`${BACKEND_URL}user/viewAllTrainers`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            params: {
                searchParam: 'trainers',
                searchValue: 'inactive',
                page: page,
                limit: limit,
            },
        });

        const listOfTrainers: Trainer[] = response.data.body?.content || [];
        const totalTrainers: number = response.data.body?.totalElements || 0;

        return {
            listOfTrainers,
            totalTrainers,
        };
    } catch (error) {
        console.error('Failed to fetch inactive trainers:', error);
        return {
            listOfTrainers: [],
            totalTrainers: 0,
        };
    }
};

export const searchTrainers = async (encryptedJWT: string, searchParam: string, searchValue: string, page: number, limit: number): Promise<FetchTrainersResponse> => {
    try {
        const jwt = decryptJWT(encryptedJWT);

        const response = await axios.get(`${BACKEND_URL}user/viewAllTrainers`, {
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

        let listOfTrainers: Trainer[] = [];
        const totalTrainers: number = response.data.body?.totalElements || 1;

        if (searchParam === 'trainerId' || searchParam === 'email') {
            listOfTrainers = Array.from([response.data.body]);
        } else {
            listOfTrainers = response.data.body?.content || [];
        }

        return {
            listOfTrainers,
            totalTrainers,
        };
    } catch (error) {
        console.error(`Failed to search trainers by ${searchParam}:`, error);
        return {
            listOfTrainers: [],
            totalTrainers: 0,
        };
    }
};

export const getAllRegisteredMembers = async (
  encryptedJWT: string,
  trainerEmail: string,
  page: number,
  limit: number
): Promise<{ listOfMembers: Member[]; totalMembers: number; error?: string }> => {
  try {
    const jwt = decryptJWT(encryptedJWT);
    if (!jwt) {
      throw new Error('Invalid JWT');
    }
    const response = await axios.get(`${BACKEND_URL}trainer/getAllRegisteredMembers`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      params: {
        trainerEmail,
        page,
        limit,
      },
    });
    if (!response.data || !response.data.body) {
      throw new Error('Invalid response from server');
    }
    const listOfMembers: Member[] = response.data.body?.content || [];
    const totalMembers: number = response.data.body?.totalElements || 0;
    return { listOfMembers, totalMembers };
  } catch (error: any) {
    return {
      listOfMembers: [],
      totalMembers: 0,
      error: error?.message || 'Failed to fetch registered members',
    };
  }
};

