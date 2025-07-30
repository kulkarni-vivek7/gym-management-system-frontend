import axios, { isAxiosError } from 'axios';
import { z } from 'zod';
import { decryptJWT } from '../../cryptoUtils';

const addMemberSchema = z.object({
    name: z.string().min(1, "Member name is required"),
    age: z.string().min(1, "Age is required").regex(/^[0-9]+$/, "Age must be a number").transform(Number).refine(age => age > 0, "Age must be positive"),
    phno: z.string().min(1, "Phone number is required").regex(/^[0-9]{10}$/, "Phone number must be 10 digits").transform(Number),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    gender: z.enum(['MALE', 'FEMALE', 'OTHERS'], { message: "Gender is required" }),
    membershipName: z.string().min(1, "Membership is required"),
    trainerId: z.string().min(1, "Trainer is required").regex(/^[0-9]+$/, "Trainer is required").transform(Number),
});

export type AddMemberFormState = {
    errors: {
        name?: string[];
        age?: string[];
        phno?: string[];
        email?: string[];
        gender?: string[];
        membershipName?: string[];
        trainerId?: string[];
        formErrors?: string[];
    };
    success?: boolean;
    timestamp?: number;
};

export async function addMemberAction(
    encryptedJwt: string,
    prevState: AddMemberFormState,
    formData: FormData
): Promise<AddMemberFormState> {
    const jwt = decryptJWT(encryptedJwt);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

    const name = formData.get('name') as string;
    const age = formData.get('age') as string;
    const phno = formData.get('phno') as string;
    const email = formData.get('email') as string;
    const gender = formData.get('gender') as 'MALE' | 'FEMALE' | 'OTHERS';
    const membershipName = formData.get('membershipName') as string;
    const trainerId = formData.get('trainerId') as string;

    const validation = addMemberSchema.safeParse({
        name,
        age,
        phno,
        email,
        gender,
        membershipName,
        trainerId,
    });

    if (!validation.success) {
        const fieldErrors = validation.error.flatten().fieldErrors;
        return {
            errors: {
                name: fieldErrors.name,
                age: fieldErrors.age,
                phno: fieldErrors.phno,
                email: fieldErrors.email,
                gender: fieldErrors.gender,
                membershipName: fieldErrors.membershipName,
                trainerId: fieldErrors.trainerId,
            },
            success: false,
            timestamp: Date.now(),
        };
    }

    try {
        const memberData = {
            name: validation.data.name,
            age: validation.data.age,
            phno: validation.data.phno,
            email: validation.data.email,
            gender: validation.data.gender,
        };

        const response = await axios.post(
            `${BACKEND_URL}user/addMember`,
            memberData,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                params: {
                    membershipName: validation.data.membershipName,
                    trainerId: validation.data.trainerId,
                }
            }
        );

        if (response.status === 201) {
            return { success: true, errors: {}, timestamp: Date.now() };
        }

        return {
            errors: { formErrors: [response.data.exceptionMessage || "Failed to add member. Please try again."] },
            success: false,
            timestamp: Date.now(),
        };
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                errors: {
                    formErrors: [
                        error.response?.data?.exceptionMessage ||
                        "Error occurred during adding member. Please try again.",
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
