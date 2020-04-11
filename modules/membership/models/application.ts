export interface ApplicationArgs {
  email: string;
  password: string;
  confirmPassword: string;
}

export default class Application {
  public email: string;
  public password: string;
  public confirmPassword: string;
  public status: string;
  public message: string;

  constructor({ email, password, confirmPassword }: ApplicationArgs) {
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.status = 'pending';
    this.message = '';
  }

  public isValid(): boolean {
    return this.status === 'validated';
  }

  public setValid(): void {
    this.status = 'validated';
  }

  public setInvalid(message: string): void {
    this.status = 'invalid';
    this.message = message;
  }

  public validate(): void {
    const { email, password } = this;

    if (!email || !password) {
      this.setInvalid('Email and password are required.');
    } else if (this.password !== this.confirmPassword) {
      this.setInvalid("Password don't match.");
    } else {
      this.setValid();
    }
  }
}
