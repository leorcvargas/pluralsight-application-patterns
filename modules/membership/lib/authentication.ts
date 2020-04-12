import bcrypt from 'bcrypt';

import { UserView, UserModel } from '../models/user';
import { generateRandomUUID } from './utility';

export interface AuthenticationResult {
  user: UserView | null;
  message: string;
  success: boolean;
}

export default class Authentication {
  public async signIn(
    email: string,
    password: string,
  ): Promise<AuthenticationResult> {
    const signInDataValid = this.validateSignInData(email, password);

    if (!signInDataValid) {
      return this.buildAuthenticationResult(
        'Email and password are required.',
        false,
      );
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return this.buildAuthenticationResult('User not found.', false);
    }

    const validPassword = await this.validateUserPassword(
      password,
      user.password,
    );

    if (!validPassword) {
      return this.buildAuthenticationResult('Invalid password.', false);
    }

    user.lastLoginAt = user.currentLoginAt;
    user.currentLoginAt = new Date();
    user.signInCount += 1;
    user.authenticationToken = generateRandomUUID();
    await user.save();

    return this.buildAuthenticationResult('Welcome!', true, user.view);
  }

  private async validateUserPassword(
    inputedPassword: string,
    hashPassword: string,
  ): Promise<boolean> {
    const result = await bcrypt.compare(inputedPassword, hashPassword);

    return result;
  }

  private validateSignInData(email: string, password: string): boolean {
    return !!email && !!password;
  }

  private buildAuthenticationResult(
    message = '',
    success = false,
    user: UserView | null = null,
  ): AuthenticationResult {
    return {
      message,
      success,
      user,
    };
  }
}
