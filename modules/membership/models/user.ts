import { prop, getModelForClass } from '@typegoose/typegoose';

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

export class User {
  @prop()
  public email: string;
  @prop()
  public createdAt: Date;
  @prop()
  public status: string;
  @prop()
  public signInCount: number;
  @prop()
  public lastLoginAt: Date;
  @prop()
  public currentLoginAt: Date;
  @prop()
  public authenticationToken: string;

  constructor(args: UserArgs) {
    const {
      email,
      createdAt,
      status,
      signInCount,
      lastLoginAt,
      currentLoginAt,
      authenticationToken,
    } = args;

    this.email = email;
    this.createdAt = createdAt || new Date();
    this.status = status || 'pending';
    this.signInCount = signInCount || 0;
    this.lastLoginAt = lastLoginAt || new Date();
    this.currentLoginAt = currentLoginAt || new Date();
    this.authenticationToken = authenticationToken || generateRandomUUID();
  }
}

export const UserModel = getModelForClass(User);
