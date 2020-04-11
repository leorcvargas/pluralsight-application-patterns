import Application, { ApplicationArgs } from '../models/application';
import { User, UserModel } from '../models/user';

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
      return this.buildRegistrationResult({
        user: new User({ email: args.email }),
        message: 'Welcome!',
        success: true,
      });
    }

    return this.buildRegistrationResult({
      success: false,
      message: application.message,
    });
  };

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
