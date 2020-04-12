import mongoose from 'mongoose';

import Authentication, { AuthenticationResult } from '../lib/authentication';
import Registration from '../lib/registration';
import { UserModel, User } from '../models/user';
import { DocumentType } from '@typegoose/typegoose';

describe('Authentication', () => {
  const auth = new Authentication();
  const registration = new Registration();
  let user: DocumentType<User>;

  beforeAll(async () => {
    await mongoose.connect(String(process.env.MONGO_URL), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await registration.applyForMemberShip({
      email: 'leo@dev.com',
      password: 'foobar',
      confirmPassword: 'foobar',
    });
    const createdUser = await UserModel.findOne({ email: 'leo@dev.com' });

    if (!createdUser) {
      throw new Error('Failed to setup user');
    }

    user = createdUser;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('valid login', () => {
    let result: AuthenticationResult;

    beforeAll(async () => {
      result = await auth.signIn('leo@dev.com', 'foobar');
    });

    it('is successful', () => {
      expect(result.success).toBeTruthy();
    });

    it('returns a user', () => {
      expect(result.user).toBeDefined();
    });

    it('updates the user stats', () => {
      expect(result.user?.authenticationToken).not.toBe(
        user.authenticationToken,
      );
      expect(result.user?.currentLoginAt).not.toBe(user.currentLoginAt);
      expect(result.user?.lastLoginAt).not.toBe(user.lastLoginAt);
      expect(result.user?.signInCount).toBeGreaterThan(user.signInCount);
      expect(result.user?.signInCount).toBeGreaterThan(user.signInCount);
    });
  });

  describe('empty email', () => {
    let result: AuthenticationResult;

    beforeAll(async () => {
      result = await auth.signIn('', 'foobar');
    });

    it('is not successful', () => {
      expect(result.success).toBeFalsy();
    });

    it('returns a message', () => {
      expect(result.message).toBe('Email and password are required.');
    });
  });

  describe('empty password', () => {
    let result: AuthenticationResult;

    beforeAll(async () => {
      result = await auth.signIn('leo@dev.com', '');
    });

    it('is not successful', () => {
      expect(result.success).toBeFalsy();
    });

    it('returns a message', () => {
      expect(result.message).toBe('Email and password are required.');
    });
  });

  describe("password doesn't match", () => {
    let result: AuthenticationResult;

    beforeAll(async () => {
      result = await auth.signIn('leo@dev.com', 'barfoo1231312321');
    });

    it('is not successful', () => {
      expect(result.success).toBeFalsy();
    });

    it('returns a message', () => {
      expect(result.message).toBe('Invalid password.');
    });
  });

  describe('email not found', () => {
    let result: AuthenticationResult;

    beforeAll(async () => {
      result = await auth.signIn('leo2131232@dev.com', 'foobar');
    });

    it('is not successful', () => {
      expect(result.success).toBeFalsy();
    });

    it('returns a message', () => {
      expect(result.message).toBe('User not found.');
    });
  });
});
