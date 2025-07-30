import axios, { isAxiosError } from 'axios';
import { z } from 'zod';

// Zod schema to validate all fields
const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    age: z
        .string()
        .min(1, "Age is required")
        .regex(/^\d+$/, "Age must be a number")
        .transform(Number)
        .refine(age => age >= 10 && age <= 120, "Age must be between 10 and 120"),
    email: z.string().email("Valid Email address is required"),
    phno: z
        .string()
        .min(10, "Phone number must be 10 digits")
        .max(10, "Phone number must be 10 digits")
        .regex(/^\d+$/, "Phone number must contain only digits"),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"], "Select a valid gender"),
});

export type RegisterFormState = {
    errors: {
        name?: string[];
        age?: string[];
        email?: string[];
        phno?: string[];
        gender?: string[];
        formErrors?: string[];
    };
    success?: boolean;
};

export async function registerAction(
    prevState: RegisterFormState,
    formData: FormData
): Promise<RegisterFormState> {
    // Convert FormData to plain object for validation
    const name = formData.get('name') as string;
    const age = formData.get('age') as string;
    const email = formData.get('email') as string;
    const phno = formData.get('phno') as string;
    const gender = formData.get('gender') as string;

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

    // Validate using Zod
    const validation = registerSchema.safeParse({
        name,
        age,
        email,
        phno,
        gender
    });

    if (!validation.success) {
        const fieldErrors = validation.error.flatten().fieldErrors;

        return {
            errors: {
                name: fieldErrors.name,
                age: fieldErrors.age,
                email: fieldErrors.email,
                phno: fieldErrors.phno,
                gender: fieldErrors.gender,
            },
            success: false,
        };
    }

    try {

        const adminData = {
            name,
            age,
            email,
            phno,
            gender
        }
        
        const response = await axios.post(`${BACKEND_URL}api/auth/register`, adminData);

        if (response.status === 201) {
            return { success: true, errors: {} };
        }

        return {
            errors: { formErrors: [response.data.exceptionMessage || "Registration failed. Please try again."] },
            success: false,
        };
    }
    catch (error) {
        if (isAxiosError(error)) {
            return {
                errors: {
                    formErrors: [
                        error.response?.data?.exceptionMessage ||
                        "Error occurred during registration. Please try again.",
                    ],
                },
                success: false,
            };
        }

        return {
            errors: {
                formErrors: ["Some internal error occurred. Please try again later."],
            },
            success: false,
        };
    }
}
