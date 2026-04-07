import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

function makeMockUser(overrides: Record<string, any> = {}) {
  const base = {
    _id: 'user-id-123',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashed-password',
    ...overrides,
  };
  return { ...base, toObject: () => ({ ...base }) };
}

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<Pick<UsersService, 'findByEmail' | 'create' | 'findById'>>;
  let jwtService: jest.Mocked<Pick<JwtService, 'sign'>>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
    };
    jwtService = { sign: jest.fn().mockReturnValue('mock-jwt-token') };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.restoreAllMocks());

  describe('validateUser', () => {
    it('returns user without password when credentials are valid', async () => {
      const mockUser = makeMockUser();
      usersService.findByEmail.mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser('test@example.com', 'correct-password');

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('test@example.com');
      expect(result.username).toBe('testuser');
    });

    it('returns null when password is incorrect', async () => {
      const mockUser = makeMockUser();
      usersService.findByEmail.mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await service.validateUser('test@example.com', 'wrong-password');

      expect(result).toBeNull();
    });

    it('returns null when user does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('notfound@example.com', 'any');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('returns access_token and user info', async () => {
      const user = { _id: 'user-id-123', email: 'test@example.com', username: 'testuser' };

      const result = await service.login(user);

      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.user).toEqual({
        id: 'user-id-123',
        email: 'test@example.com',
        username: 'testuser',
      });
    });

    it('signs JWT with correct payload', async () => {
      const user = { _id: 'user-id-123', email: 'test@example.com', username: 'testuser' };

      await service.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'test@example.com',
        sub: 'user-id-123',
        username: 'testuser',
      });
    });
  });

  describe('register', () => {
    it('creates a user and returns login result', async () => {
      const mockUser = makeMockUser();
      usersService.create.mockResolvedValue(mockUser as any);

      const result = await service.register('test@example.com', 'password123', 'testuser');

      expect(usersService.create).toHaveBeenCalledWith('test@example.com', 'password123', 'testuser');
      expect(result).toHaveProperty('access_token');
      expect(result.user.email).toBe('test@example.com');
    });
  });
});
