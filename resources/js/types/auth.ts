export type UserRole =
    | 'superadmin'
    | 'admin_penjualan'
    | 'admin_charter'
    | 'driver'
    | 'petugas_loket'
    | 'customer';

export type User = {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User | null;
};
