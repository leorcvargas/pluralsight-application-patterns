import mongoose from 'mongoose';

import Registration, { RegistrationResult } from '../lib/registration';

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

    beforeAll((done) => {
      registration
        .applyForMemberShip({
          email: 'leo@dev.com',
          password: 'foobar',
          confirmPassword: 'foobar',
        })
        .then((data) => {
          registrationResult = data;
          done();
        })
        .catch((err) => {
          throw err;
        });
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
