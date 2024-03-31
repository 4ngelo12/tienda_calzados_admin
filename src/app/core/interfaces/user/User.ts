export interface User {
    name: string;
    lastname: string;
    email: string;
    password: string;
    idRole: number;
}

export interface UserLs {
    name: string;
    lastname: string;
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

export interface UsersResponse {
    content: AllUsers[];
}

export interface AllUsers {
    id: number;
    name: string;
    lastname: string;
    email: string;
    birthdate: Date;
    active: boolean;
    role: Role;
}

export interface Role {
    id:     number;
    nombre: string;
}
