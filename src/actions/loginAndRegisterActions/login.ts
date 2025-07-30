import axios, { isAxiosError } from 'axios';
import { z } from 'zod';

// Zod schema to validate email and otp
const loginSchema = z.object({
    email: z.string().email('Valid Email address is required'),
    otp: z.string().min(6, 'OTP must be of 6 digits'),
});

export type LoginFormState = {
    errors: {
        email?: string[];
        otp?: string[];
        formErrors?: string[];
    };
    values?: {
        email?: string;
        otp?: string;
        jwt?: string;
        message?: string;
    };
};

export async function loginAction(
    prevState: LoginFormState,
    formData: FormData
): Promise<LoginFormState> {
    const email = formData.get('email') as string;
    const otp = formData.get('otp') as string;

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

    // Validate using Zod
    const validation = loginSchema.safeParse({
        email,
        otp,
    });

    if (!validation.success) {
        const fieldErrors = validation.error.flatten().fieldErrors;
        return {
            errors: {
                email: fieldErrors.email,
                otp: fieldErrors.otp,
            },
            values: { email, otp },
        };
    }

    try {
        const loginData = { email, otp };

        // bug fixed Here: Use BACKEND_URL instead of hardcoded URL
        const response = await axios.post(`${BACKEND_URL}api/auth/login`, loginData);

        if (response.status === 200 && response.data) {
            return {
                errors: {},
                values: {
                    jwt: response.data.body,
                    message: response.data.message,
                },
            };
        }

        return {
            errors: { formErrors: [response.data?.exceptionMessage || 'Login failed. Please try again.'] },
            values: { email, otp },
        };
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                errors: {
                    formErrors: [
                        error.response?.data?.exceptionMessage ||
                        'Error occurred during login. Please try again.',
                    ],
                },
                values: { email, otp },
            };
        }
        return {
            errors: {
                formErrors: ['Some internal error occurred. Please try again later.'],
            },
            values: { email, otp },
        };
    }
}
