import axios, { isAxiosError } from 'axios';
import { z } from 'zod';
import { decryptJWT } from '../../cryptoUtils';
import type { Trainer } from '../../types';

// Zod schema to validate fields for updating a trainer
const updateTrainerSchema = z.object({
    name: z.string().min(1, "Trainer name is required"),
    age: z.string().min(1, "Age is required").regex(/^[0-9]+$/, "Age must be a number").transform(Number).refine(age => age > 0, "Age must be positive"),
    phno: z.string().min(1, "Phone number is required").regex(/^[0-9]{10}$/, "Phone number must be 10 digits").transform(Number),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    salary: z.string().min(1, "Salary is required"),
    gender: z.enum(['MALE', 'FEMALE', 'OTHERS'], { message: "Gender is required" }),
    membershipName: z.string().min(1, "Membership is required"),
    originalTrainerEmail: z.string().min(1, "Original trainer email is required").email("Invalid original trainer email address"),
    status: z.enum(['ACTIVE', 'INACTIVE'], { message: "Status must be ACTIVE or INACTIVE" }),
    trainerId: z.string().optional().transform(value => value ? Number(value) : undefined),
    registerNo: z.string().optional().transform(value => value ? Number(value) : undefined),
});

export type UpdateTrainerFormState = {
    errors: {
        name?: string[];
        age?: string[];
        phno?: string[];
        email?: string[];
        salary?: string[];
        gender?: string[];
        membershipName?: string[];
        originalTrainerEmail?: string[];
        status?: string[];
        formErrors?: string[];
    };
    success?: boolean;
    timestamp?: number;
};

export async function updateTrainerAction(
    encryptedJwt: string,
    prevState: UpdateTrainerFormState,
    formData: FormData
): Promise<UpdateTrainerFormState> {
    const jwt = decryptJWT(encryptedJwt);

    const name = formData.get('name') as string;
    const age = formData.get('age') as string;
    const phno = formData.get('phno') as string;
    const email = formData.get('email') as string;
    const salary = formData.get('salary') as string;
    const gender = formData.get('gender') as 'MALE' | 'FEMALE' | 'OTHERS';
    const membershipName = formData.get('membershipName') as string;
    const originalTrainerEmail = formData.get('originalTrainerEmail') as string;
    const status = formData.get('status') as 'ACTIVE' | 'INACTIVE';
    const trainerId = formData.get('trainerId') as string | undefined;
    const registerNo = formData.get('registerNo') as string | undefined;

    const validation = updateTrainerSchema.safeParse({
        name,
        age,
        phno,
        email,
        salary,
        gender,
        membershipName,
        originalTrainerEmail,
        status,
        trainerId,
        registerNo,
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
                originalTrainerEmail: fieldErrors.originalTrainerEmail,
                status: fieldErrors.status,
            },
            success: false,
            timestamp: Date.now(),
        };
    }

    try {
        const trainerData: Trainer = {
            registerNo: validation.data.registerNo,
            trainerId: validation.data.trainerId,
            name: validation.data.name,
            age: validation.data.age,
            phno: validation.data.phno,
            email: validation.data.email,
            salary: validation.data.salary,
            gender: validation.data.gender,
            status: validation.data.status,
        };
        

        const response = await axios.put(
            `http://localhost:8080/user/updateTrainer`,
            trainerData,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                params: {
                    trainerEmail: validation.data.originalTrainerEmail,
                    membershipName: validation.data.membershipName,
                }
            }
        );
        

        if (response.status === 200) { // Assuming 200 OK for successful update
            return { success: true, errors: {}, timestamp: Date.now() };
        }

        return {
            errors: { formErrors: [response.data.exceptionMessage || "Failed to update trainer. Please try again."] },
            success: false,
            timestamp: Date.now(),
        };
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                errors: {
                    formErrors: [
                        error.response?.data?.exceptionMessage ||
                        "Error occurred during updating trainer. Please try again.",
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
