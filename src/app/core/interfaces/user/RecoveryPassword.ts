export interface RecoveryPassword {
    to: string;
    subject: string;
    template: number;
    metaData: MetaDatum[];
}

export interface MetaDatum {
    key: string;
    value: string;
}

export interface ResetPassword {
    id: number;
    password: string;
}