import Application, { ApplicationArgs } from '../models/application';
import { User, UserModel } from '../models/user';
import { DocumentType } from '@typegoose/typegoose';

export interface RegistrationResult {
  success: boolean;
  message: string;
  user: User | null;
}

export default class Registration {
  public applyForMemberShip = async (
    args: ApplicationArgs,
  ): Promise<RegistrationResult> => {
    const application = new Application(args);
    application.validate();

    const userExists = await this.checkIfUserExists(application.email);
    if (userExists) {
      application.setInvalid('Email already exists.');
    }

    if (application.isValid()) {
      const user = await this.saveUser(args);

      return this.buildRegistrationResult({
        message: 'Welcome!',
        success: true,
        user,
      });
    }

    return this.buildRegistrationResult({
      success: false,
      message: application.message,
    });
  };

  private async saveUser({
    email,
    password,
  }: ApplicationArgs): Promise<DocumentType<User>> {
    const userData = new User({
      email,
      password,
      status: 'approved',
      signInCount: 1,
    });
    const user = await UserModel.create(userData);

    return user;
  }

  private buildRegistrationResult(
    args: Partial<RegistrationResult>,
  ): RegistrationResult {
    const { message = '', success = false, user = null } = args;

    const result = {
      message,
      success,
      user,
    };

    return result;
  }

  private async checkIfUserExists(email: string): Promise<boolean> {
    return UserModel.exists({ email });
  }
}
