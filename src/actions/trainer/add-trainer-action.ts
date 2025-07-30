import axios, { isAxiosError } from 'axios';
import { z } from 'zod';
import { decryptJWT } from '../../cryptoUtils';

// Zod schema to validate all fields
const addTrainerSchema = z.object({
    name: z.string().min(1, "Trainer name is required"),
    age: z.string().min(1, "Age is required").regex(/^[0-9]+$/, "Age must be a number").transform(Number).refine(age => age > 0, "Age must be positive"),
    phno: z.string().min(1, "Phone number is required").regex(/^[0-9]{10}$/, "Phone number must be 10 digits").transform(Number),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    salary: z.string().min(1, "Salary is required").regex(/^\d+(\.\d+)?$/, "Salary must be a valid number").transform(Number).refine(salary => salary > 0, "Salary must be positive"),
    gender: z.enum(['MALE', 'FEMALE', 'OTHERS'], { message: "Gender is required" }),
    membershipName: z.string().min(1, "Membership is required"),
});

export type AddTrainerFormState = {
    errors: {
        name?: string[];
        age?: string[];
        phno?: string[];
        email?: string[];
        salary?: string[];
        gender?: string[];
        membershipName?: string[];
        formErrors?: string[];
    };
    success?: boolean;
    timestamp?: number;
};

export async function addTrainerAction(
    encryptedJwt: string,
    prevState: AddTrainerFormState,
    formData: FormData
): Promise<AddTrainerFormState> {
    const jwt = decryptJWT(encryptedJwt);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

    const name = formData.get('name') as string;
    const age = formData.get('age') as string;
    const phno = formData.get('phno') as string;
    const email = formData.get('email') as string;
    const salary = formData.get('salary') as string;
    const gender = formData.get('gender') as 'MALE' | 'FEMALE' | 'OTHERS';
    const membershipName = formData.get('membershipName') as string;

    const validation = addTrainerSchema.safeParse({
        name,
        age,
        phno,
        email,
        salary,
        gender,
        membershipName,
    });

    if (!validation.success) {
        const fieldErrors = validation.error.flatten().fieldErrors;

        return {
            errors: {
                name: fieldErrors.name,
                age: fieldErrors.age,
                phno: fieldErrors.phno,
                email: fieldErrors.email,
                salary: fieldErrors.salary,
                gender: fieldErrors.gender,
                membershipName: fieldErrors.membershipName,
            },
            success: false,
            timestamp: Date.now(),
        };
    }

    try {
        const trainerData = {
            name: validation.data.name,
            age: validation.data.age,
            phno: validation.data.phno,
            email: validation.data.email,
            salary: validation.data.salary,
            gender: validation.data.gender,
        };

        const response = await axios.post(
            `${BACKEND_URL}user/addTrainer`,
            trainerData,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                params: {
                    membershipName: validation.data.membershipName,
                }
            }
        );

        if (response.status === 201) {
            return { success: true, errors: {}, timestamp: Date.now() };
        }

        return {
            errors: { formErrors: [response.data.exceptionMessage || "Failed to add trainer. Please try again."] },
            success: false,
            timestamp: Date.now(),
        };
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                errors: {
                    formErrors: [
                        error.response?.data?.exceptionMessage ||
                        "Error occurred during adding trainer. Please try again.",
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
