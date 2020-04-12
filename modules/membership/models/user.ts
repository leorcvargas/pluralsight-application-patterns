import { prop, getModelForClass, pre } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';

import { generateRandomUUID } from '../lib/utility';

export interface UserInterface {
  email: string;
  password: string;
  createdAt: Date;
  status: string;
  signInCount: number;
  lastLoginAt: Date;
  currentLoginAt: Date;
  authenticationToken: string;
}

export type UserView = Omit<UserInterface, 'password'>;

interface UserArgs {
  email: string;
  password: string;
  createdAt?: Date;
  status?: string;
  signInCount?: number;
  lastLoginAt?: Date;
  currentLoginAt?: Date;
  authenticationToken?: string;
}

@pre<User>('save', async function () {
  this.password = await bcrypt.hash(this.password, 10);
})
export class User implements UserInterface {
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

  public get view(): UserView {
    return {
      email: this.email,
      createdAt: this.createdAt,
      status: this.status,
      signInCount: this.signInCount,
      lastLoginAt: this.lastLoginAt,
      currentLoginAt: this.currentLoginAt,
      authenticationToken: this.authenticationToken,
    };
  }

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
