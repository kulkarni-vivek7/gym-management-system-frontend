export type Admin = {
    id?: string;
    name: string;
    email: string;
    phno: string;
    age: string;
    gender: 'MALE' | 'FEMALE' | 'OTHERS';
    status?: 'ACTIVE' | 'INACTIVE';
};

export type Membership = {
    id?: number;
    name: string;
    duration: string;
    price: string;
    status?: 'ACTIVE' | 'INACTIVE';
}

export type Trainer = {
    registerNo?: number;
    trainerId?: number;
    name: string;
    age: number;
    phno: number;
    email: string;
    salary: string;
    gender: string;
    membership?: Membership;
    status?: string;
}

export type Member = {
    registerNo?: number;
    memberId?: number;
    name: string;
    age: number;
    phno: number;
    email: string;
    gender: string;
    trainer?: Trainer;
    membership?: Membership;
    status?: string;
}

