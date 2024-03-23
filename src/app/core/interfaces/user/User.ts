export interface User {
    name: string;
    lastname: string;
    email: string;
    password: string;
    idRole: number;
}

export interface UserLs {
    name: string;
    lastName: string;
    email: string;
    birthdate: Date;
}

export interface UpdateUser {
    id: number;
    name: string;
    lastname: string;
    email: string;
    birthdate: Date;
}

export interface UserId {
    id: number;
}