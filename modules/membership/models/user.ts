import { generateRandomUUID } from '../lib/utility';

interface UserArgs {
    email: string;
    createdAt?: Date;
    status?: string;
    signInCount?: number;
    lastLoginAt?: Date;
    currentLoginAt?: Date;
    currentSessionToken?: string;
    reminderSentAt?: Date;
    reminderToken?: string;
    authenticationToken?: string;
}

export default class User {
    public email: string;
    public createdAt: Date;
    public status: string;
    public signInCount: number;
    public lastLoginAt: Date;
    public currentLoginAt: Date;
    public currentSessionToken: string | null;
    public reminderSentAt: Date | null;
    public reminderToken: string | null;
    public authenticationToken: string;

    constructor(args: UserArgs) {
        const {
            email,
            createdAt,
            status,
            signInCount,
            lastLoginAt,
            currentLoginAt,
            currentSessionToken,
            reminderSentAt,
            reminderToken,
            authenticationToken,
        } = args;

        this.email = email;
        this.createdAt = createdAt || new Date();
        this.status = status || 'pending';
        this.signInCount = signInCount || 0;
        this.lastLoginAt = lastLoginAt || new Date();
        this.currentLoginAt = currentLoginAt || new Date();
        this.currentSessionToken = currentSessionToken || null;
        this.reminderSentAt = reminderSentAt || null;
        this.reminderToken = reminderToken || null;
        this.authenticationToken = authenticationToken || generateRandomUUID();
    }
}