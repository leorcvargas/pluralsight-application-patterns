import { User } from '../models/user';

describe('User', () => {
  describe('defaults', () => {
    const user = new User({ email: 'leo@dev.com', password: 'foobar' });

    it('email is leo@dev.com', () => {
      expect(user.email).toBe('leo@dev.com');
    });

    it('has an authentication token', () => {
      expect(user.authenticationToken).toBeDefined();
    });

    it('has a pending status', () => {
      expect(user.status).toBe('pending');
    });

    it('has a created date', () => {
      expect(user.createdAt).toBeDefined();
    });

    it('has a signInCount of 0', () => {
      expect(user.signInCount).toBe(0);
    });

    it('has lastLogin', () => {
      expect(user.lastLoginAt).toBeDefined();
    });

    it('has currentLogin', () => {
      expect(user.currentLoginAt).toBeDefined();
    });
  });
});
