import axios, { isAxiosError } from 'axios';
import { z } from 'zod';
import { decryptJWT } from '../../cryptoUtils';
import type { Membership } from '../../types';

// Zod schema to validate all fields for updating a membership
const updateMembershipSchema = z.object({
    id: z.string().transform(Number).refine(id => id > 0, "Membership ID must be positive"),
    name: z.string().min(1, "Membership name is required"),
    duration: z
        .string()
        .min(1, "Duration is required"),
    price: z
        .string()
        .min(1, "Price is required")
        .regex(/^\d+(\.\d+)?$/, "Price must be a valid number")
        .transform(Number)
        .refine(price => price > 0, "Price must be positive"),
    status: z.enum(['ACTIVE', 'INACTIVE'], { message: "Status must be ACTIVE or INACTIVE" }),
});

export type UpdateMembershipFormState = {
    errors: {
        id?: string[];
        name?: string[];
        duration?: string[];
        price?: string[];
        status?: string[];
        formErrors?: string[];
    };
    success?: boolean;
    timestamp?: number;
};

export async function updateMembershipAction(
    encryptedJwt: string,
    prevState: UpdateMembershipFormState,
    formData: FormData
): Promise<UpdateMembershipFormState> {
    const jwt = decryptJWT(encryptedJwt);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const duration = formData.get('duration') as string;
    const price = formData.get('price') as string;
    const status = formData.get('status') as 'ACTIVE' | 'INACTIVE';

    const validation = updateMembershipSchema.safeParse({
        id,
        name,
        duration,
        price,
        status
    });

    if (!validation.success) {
        const fieldErrors = validation.error.flatten().fieldErrors;

        return {
            errors: {
                id: fieldErrors.id,
                name: fieldErrors.name,
                duration: fieldErrors.duration,
                price: fieldErrors.price,
                status: fieldErrors.status,
            },
            success: false,
            timestamp: Date.now(),
        };
    }

    try {
        const membershipData: Membership = {
            id: validation.data.id,
            name: validation.data.name,
            duration: validation.data.duration,
            price: validation.data.price.toString(), // Convert back to string for sending
            status: validation.data.status,
        };

        const response = await axios.put(
            `${BACKEND_URL}user/updateMembership`,
            membershipData,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );

        if (response.status === 200) { // Assuming 200 OK for successful update
            return { success: true, errors: {}, timestamp: Date.now() };
        }

        return {
            errors: { formErrors: [response.data.exceptionMessage || "Failed to update membership. Please try again."] },
            success: false,
            timestamp: Date.now(),
        };
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                errors: {
                    formErrors: [
                        error.response?.data?.exceptionMessage ||
                        "Error occurred during updating membership. Please try again.",
                    ],
                },
                success: false,
                timestamp: Date.now(),
            };
        }

        return {
            errors: {
                formErrors: ["Some internal error occurred. Please try again later."],
            },
            success: false,
            timestamp: Date.now(),
        };
    }
}

