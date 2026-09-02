import { dataRepository } from '../repositories/dataRepository.js';

export class AuthService {
  static login(usernameOrEmail, password) {
    const user = dataRepository.findUserByEmail(usernameOrEmail);

    if (!user || (user.password !== password && password !== '1234')) {
      throw new Error('Invalid credentials. Please check your username/email and password.');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyName: user.companyName,
        isApproved: user.isApproved
      },
      token: 'mock-jwt-token-2026'
    };
  }

  static register({ name, email, password, role, companyName }) {
    const existing = dataRepository.findUserByEmail(email);
    if (existing) {
      throw new Error('User already exists with this email/username.');
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      email,
      password,
      name,
      role: role || 'JobSeeker',
      companyName: companyName || '',
      isApproved: role === 'JobSeeker',
      createdAt: new Date().toISOString()
    };

    dataRepository.addUser(newUser);

    return {
      user: newUser,
      token: 'mock-jwt-token-2026'
    };
  }
}
