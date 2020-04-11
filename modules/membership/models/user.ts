import { prop, getModelForClass, pre } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';

import { generateRandomUUID } from '../lib/utility';

interface UserArgs {
  email: string;
  password: string;
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

@pre<User>('save', async function () {
  this.password = await bcrypt.hash(this.password, 10);
})
export class User {
  @prop()
  public id!: string;

  @prop()
  public email: string;

  @prop()
  public password: string;

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
      password,
      createdAt,
      status,
      signInCount,
      lastLoginAt,
      currentLoginAt,
      authenticationToken,
    } = args;

    this.email = email;
    this.password = password;
    this.createdAt = createdAt || new Date();
    this.status = status || 'pending';
    this.signInCount = signInCount || 0;
    this.lastLoginAt = lastLoginAt || new Date();
    this.currentLoginAt = currentLoginAt || new Date();
    this.authenticationToken = authenticationToken || generateRandomUUID();
  }
}

export const UserModel = getModelForClass(User);
