import axios, { isAxiosError } from 'axios';
import { z } from 'zod';
import { decryptJWT } from '../../cryptoUtils';
import type { Member } from '../../types';

const updateMemberSchema = z.object({
    name: z.string().min(1, "Member name is required"),
    age: z.string().min(1, "Age is required").regex(/^[0-9]+$/, "Age must be a number").transform(Number).refine(age => age > 0, "Age must be positive"),
    phno: z.string().min(1, "Phone number is required").regex(/^[0-9]{10}$/, "Phone number must be 10 digits").transform(Number),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    gender: z.enum(['MALE', 'FEMALE', 'OTHERS'], { message: "Gender is required" }),
    status: z.enum(['ACTIVE', 'INACTIVE'], { message: "Status must be ACTIVE or INACTIVE" }),
    memberId: z.string().optional().transform(value => value ? Number(value) : undefined),
    registerNo: z.string().optional().transform(value => value ? Number(value) : undefined),
    originalMemberEmail: z.string().min(1, "Original member email is required").email("Invalid original member email address"),
    membershipName: z.string().min(1, "Membership is required"),
    trainerId: z.string().min(1, "Trainer is required").regex(/^[0-9]+$/, "Trainer is required").transform(Number),
});

export type UpdateMemberFormState = {
    errors: {
        name?: string[];
        age?: string[];
        phno?: string[];
        email?: string[];
        gender?: string[];
        status?: string[];
        memberId?: string[];
        registerNo?: string[];
        originalMemberEmail?: string[];
        membershipName?: string[];
        trainerId?: string[];
        formErrors?: string[];
    };
    success?: boolean;
    timestamp?: number;
};

export async function updateMemberAction(
    encryptedJwt: string,
    prevState: UpdateMemberFormState,
    formData: FormData
): Promise<UpdateMemberFormState> {
    const jwt = decryptJWT(encryptedJwt);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

    const name = formData.get('name') as string;
    const age = formData.get('age') as string;
    const phno = formData.get('phno') as string;
    const email = formData.get('email') as string;
    const gender = formData.get('gender') as 'MALE' | 'FEMALE' | 'OTHERS';
    const status = formData.get('status') as 'ACTIVE' | 'INACTIVE';
    const memberId = formData.get('memberId') as string | undefined;
    const registerNo = formData.get('registerNo') as string | undefined;
    const originalMemberEmail = formData.get('originalMemberEmail') as string;
    const membershipName = formData.get('membershipName') as string;
    const trainerId = formData.get('trainerId') as string;

    const validation = updateMemberSchema.safeParse({
        name,
        age,
        phno,
        email,
        gender,
        status,
        memberId,
        registerNo,
        originalMemberEmail,
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
                status: fieldErrors.status,
                memberId: fieldErrors.memberId,
                registerNo: fieldErrors.registerNo,
                originalMemberEmail: fieldErrors.originalMemberEmail,
                membershipName: fieldErrors.membershipName,
                trainerId: fieldErrors.trainerId,
            },
            success: false,
            timestamp: Date.now(),
        };
    }

    try {
        const memberData: Member = {
            registerNo: validation.data.registerNo,
            memberId: validation.data.memberId,
            name: validation.data.name,
            age: validation.data.age,
            phno: validation.data.phno,
            email: validation.data.email,
            gender: validation.data.gender,
            status: validation.data.status,
        };

        const response = await axios.put(
            `${BACKEND_URL}user/updateMember`,
            memberData,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                params: {
                    memberEmail: validation.data.originalMemberEmail,
                    membershipName: validation.data.membershipName,
                    trainerId: validation.data.trainerId,
                }
            }
        );

        if (response.status === 200) {
            return { success: true, errors: {}, timestamp: Date.now() };
        }

        return {
            errors: { formErrors: [response.data.exceptionMessage || "Failed to update member. Please try again."] },
            success: false,
            timestamp: Date.now(),
        };
    } catch (error) {
        if (isAxiosError(error)) {
            return {
                errors: {
                    formErrors: [
                        error.response?.data?.exceptionMessage ||
                        "Error occurred during updating member. Please try again.",
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
