import mongoose from 'mongoose';

import Registration, { RegistrationResult } from '../lib/registration';
import { UserModel } from '../models/user';

describe('Registration', () => {
  const registration = new Registration();

  beforeAll(async () => {
    await mongoose.connect(String(process.env.MONGO_URL), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('a valid application', () => {
    let registrationResult: RegistrationResult;

    beforeAll(async () => {
      registrationResult = await registration.applyForMemberShip({
        email: 'leo@dev.com',
        password: 'foobar',
        confirmPassword: 'foobar',
      });
    });

    afterAll(async () => {
      await UserModel.deleteMany({});
    });

    it('is successful', () => {
      expect(registrationResult.success).toBeTruthy();
    });

    it('creates a user', () => {
      expect(registrationResult.user).toBeDefined();
      expect(registrationResult.user?.password).not.toBe('foobar');
    });

    it('sets the user status to approved', () => {
      expect(registrationResult.user?.status).toBe('approved');
    });

    it('offers a welcome message', () => {
      expect(registrationResult.message).toBe('Welcome!');
    });

    it('increments the sign in count', () => {
      expect(registrationResult.user?.signInCount).toBe(1);
    });
  });

  describe('an empty or null email', () => {
    let registrationResult: RegistrationResult;

    beforeAll(async () => {
      registrationResult = await registration.applyForMemberShip({
        email: '',
        password: 'foobar',
        confirmPassword: 'foobar',
      });
    });

    it('is not successful', () => {
      expect(registrationResult.success).toBeFalsy();
    });

    it('tells user that email is required', () => {
      expect(registrationResult.message).toBe(
        'Email and password are required.',
      );
    });
  });

  describe('an empty or null password', () => {
    let registrationResult: RegistrationResult;

    beforeAll(async () => {
      registrationResult = await registration.applyForMemberShip({
        email: 'leo@dev.com',
        password: '',
        confirmPassword: '',
      });
    });

    it('is not successful', () => {
      expect(registrationResult.success).toBeFalsy();
    });

    it('tells user that password is required', () => {
      expect(registrationResult.message).toBe(
        'Email and password are required.',
      );
    });
  });

  describe('password and confirm mismatch', () => {
    let registrationResult: RegistrationResult;

    beforeAll(async () => {
      registrationResult = await registration.applyForMemberShip({
        email: 'leo@dev.com',
        password: 'aaaaaa',
        confirmPassword: 'bbbbbbb',
      });
    });

    it('is not successful', () => {
      expect(registrationResult.success).toBeFalsy();
    });

    it("tells user that passwords don't match", () => {
      expect(registrationResult.message).toBe("Passwords don't match.");
    });
  });

  describe('email already exists', () => {
    const apply = (): Promise<RegistrationResult> =>
      registration.applyForMemberShip({
        email: 'leo@dev.com',
        password: 'foobar',
        confirmPassword: 'foobar',
      });

    beforeAll(async () => {
      await apply();
    });

    it('is not successful', async () => {
      const result = await apply();

      expect(result.success).toBeFalsy();
    });
    it('tells user that email already exists', async () => {
      const result = await apply();

      expect(result.message).toBe('Email already exists.');
    });
  });
});
