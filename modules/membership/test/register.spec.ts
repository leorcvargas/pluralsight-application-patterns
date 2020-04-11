import mongoose from 'mongoose';

import Registration, { RegistrationResult } from '../lib/registration';

const registration = new Registration();

describe('Registration', () => {
  beforeAll(async () => {
    await mongoose.connect(String(process.env.MONGO_URL), {
      useNewUrlParser: true,
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

    it('is successful', () => {
      expect(registrationResult.success).toBeTruthy();
    });

    it('creates a user', () => {
      expect(registrationResult.user).toBeDefined();
    });

    it.todo('creates a log entry');
    it.todo('sets the user status to approved');
    it.todo('offers a welcome message');
  });

  describe('an empty or null email', () => {
    it.todo('is not successful');
    it.todo('tells user that email is required');
  });

  describe('an empty or null password', () => {
    it.todo('is not successful');
    it.todo('tells user that password is required');
  });

  describe('password and confirm mismatch', () => {
    it.todo('is not successful');
    it.todo("tells user that passwords don't match");
  });

  describe('email already exists', () => {
    it.todo('is not successful');
    it.todo('tells user that email already exists');
  });
});
