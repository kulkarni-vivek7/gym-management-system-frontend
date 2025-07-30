import axios, { isAxiosError } from 'axios';
import { z } from 'zod';
import type { Admin } from '../../types';
import { decryptJWT } from '../../cryptoUtils';

const updateAdminSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    age: z
        .union([z.string(), z.number()])
        .refine(val => {
            const num = typeof val === 'string' ? Number(val) : val;
            return !isNaN(num) && num >= 10 && num <= 120;
        }, 'Age must be between 10 and 120'),
    email: z.string().email('Valid Email address is required'),
    phno: z
        .coerce.string()
        .min(10, 'Phone number must be 10 digits')
        .max(10, 'Phone number must be 10 digits')
        .regex(/^\d+$/, 'Phone number must contain only digits'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHERS'], 'Select a valid gender'),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export type UpdateAdminFormState = {
    errors: {
        name?: string[];
        age?: string[];
        email?: string[];
        phno?: string[];
        gender?: string[];
        status?: string[];
        formErrors?: string[];
    };
    success?: boolean;
};

export async function updateAdminAction(
    prevState: UpdateAdminFormState,
    admin: Admin,
    adminEmail: string,
    encryptedJwt: string
): Promise<UpdateAdminFormState> {
    // Validate using Zod

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

    const validation = updateAdminSchema.safeParse(admin);
    if (!validation.success) {
        const fieldErrors = validation.error.flatten().fieldErrors;
        return {
            errors: {
                name: fieldErrors.name,
                age: fieldErrors.age,
                email: fieldErrors.email,
                phno: fieldErrors.phno,
                gender: fieldErrors.gender,
                status: fieldErrors.status,
            },
            success: false,
        };
    }

    const jwt = decryptJWT(encryptedJwt);
    
    if (!jwt) {
        return {
            errors: { formErrors: ['Invalid JWT. Please login again.'] },
            success: false,
        };
    }

    try {
        const response = await axios.put(
            `${BACKEND_URL}user`,
            admin,
            {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                },
                params: {
                    adminEmail: adminEmail,
                },
            }
        );
        if (response.status === 200) {
            return { success: true, errors: {} };
        }
        return {
            errors: { formErrors: [response.data?.exceptionMessage || 'Update failed. Please try again.'] },
            success: false,
        };
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                errors: {
                    formErrors: [
                        error.response?.data?.exceptionMessage ||
                        'Error occurred during update. Please try again.',
                    ],
                },
                success: false,
            };
        }
        return {
            errors: {
                formErrors: ['Some internal error occurred. Please try again later.'],
            },
            success: false,
        };
    }
}
