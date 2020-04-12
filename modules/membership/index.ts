import Authentication, { AuthenticationResult } from './lib/authentication';
import Registration, { RegistrationResult } from './lib/registration';

export class Membership {
  constructor(
    private readonly authentication: Authentication,
    private readonly registration: Registration,
  ) {}

  public async authenticate(
    email: string,
    password: string,
  ): Promise<AuthenticationResult> {
    const authResult = await this.authentication.signIn(email, password);

    return authResult;
  }

  public async register(
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<RegistrationResult> {
    const registrationResult = await this.registration.applyForMemberShip({
      email,
      password,
      confirmPassword,
    });

    return registrationResult;
  }
}

export default new Membership(new Authentication(), new Registration());
