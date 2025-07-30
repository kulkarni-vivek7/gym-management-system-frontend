import axios, { isAxiosError } from 'axios';
import { z } from 'zod';

const sendOtpSchema = z.email('Email Is Required To Send OTP');

export type SendOtpFormState = {
    errors: {
        email?: string[],
        formErrors?: string[]
    },
    success?: boolean
}

export async function sendOtpAction(
    prevState: SendOtpFormState,
    email: string
): Promise<SendOtpFormState> {

    const validation = sendOtpSchema.safeParse(email);

    if (email.length === 0) {
        return {
            errors: {
                email: [validation.error?.flatten().formErrors[0] || "Email is required to send OTP"]
            },
            success: false,
        };
    }

    try {
        const response = await axios.get(
            `http://localhost:8080/api/auth/send-otp-email`, {
            params: {
                email: email
            }
        }
        );

        if (response.status === 200) {
            return {
                success: true,
                errors: {}, // explicitly empty errors object
            };
        }

        return {
            errors: {
                formErrors: ['Failed to send OTP. Please try again.'],
            },
            success: false,
        };

    } catch (error) {
        if (isAxiosError(error)) {
            
            return {
                errors: {
                    formErrors: [
                        error.response?.data?.exceptionMessage ||
                        'Error While Sending the OTP, Please Try Again',
                    ],
                },
                success: false,
            };
        }

        return {
            errors: {
                formErrors: ['Some Internal Error Occurred, Please Try Again Later'],
            },
            success: false,
        };
    }
}
