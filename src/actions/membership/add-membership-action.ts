
import axios, { isAxiosError } from 'axios';
import { z } from 'zod';
import { decryptJWT } from '../../cryptoUtils'; // Import decryptJWT

// Zod schema to validate all fields
const addMembershipSchema = z.object({
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
});

export type AddMembershipFormState = {
    errors: {
        name?: string[];
        duration?: string[];
        price?: string[];
        formErrors?: string[];
    };
    success?: boolean;
    timestamp?: number;
};

export async function addMembershipAction(
    encryptedJwt: string, // Change parameter name to encryptedJwt
    prevState: AddMembershipFormState,
    formData: FormData
): Promise<AddMembershipFormState> {
    const jwt = decryptJWT(encryptedJwt); // Decrypt the JWT

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

    const name = formData.get('name') as string;
    const duration = formData.get('duration') as string;
    const price = formData.get('price') as string;

    const validation = addMembershipSchema.safeParse({
        name,
        duration,
        price
    });

    if (!validation.success) {
        const fieldErrors = validation.error.flatten().fieldErrors;

        return {
            errors: {
                name: fieldErrors.name,
                duration: fieldErrors.duration,
                price: fieldErrors.price,
            },
            success: false,
            timestamp: Date.now(),
        };
    }

    try {
        const membershipData = {
            name,
            duration: validation.data.duration,
            price: validation.data.price,       // Use transformed number
        };

        const response = await axios.post(
            // bug fixed Here: Use BACKEND_URL instead of hardcoded URL
            `${BACKEND_URL}user/addMembership`,
            membershipData,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        );

        if (response.status === 201) {
            return { success: true, errors: {}, timestamp: Date.now() };
        }

        return {
            errors: { formErrors: [response.data.exceptionMessage || "Failed to add membership. Please try again."] },
            success: false,
            timestamp: Date.now(),
        };
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                errors: {
                    formErrors: [
                        error.response?.data?.exceptionMessage ||
                        "Error occurred during adding membership. Please try again.",
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

