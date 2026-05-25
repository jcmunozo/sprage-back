import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

const userId = new Types.ObjectId();
const VALID_CODE = 'secret-invite-code';

function makeMockUser(overrides: Record<string, any> = {}) {
  return {
    _id: userId,
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashed-password',
    ...overrides,
  };
}

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<
    Pick<UsersService, 'findByEmailWithPassword' | 'create' | 'findById'>
  >;
  let jwtService: jest.Mocked<Pick<JwtService, 'sign'>>;
  // The REGISTRATION_CODE value returned by the mocked ConfigService; tests
  // tweak it to simulate "enabled", "disabled" (undefined), etc.
  let registrationCode: string | undefined;

  beforeEach(async () => {
    usersService = {
      findByEmailWithPassword: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
    };
    jwtService = { sign: jest.fn().mockReturnValue('mock-jwt-token') };
    registrationCode = VALID_CODE;
    const configService = {
      get: jest.fn((key: string) => (key === 'REGISTRATION_CODE' ? registrationCode : undefined)),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.restoreAllMocks());

  describe('validateUser', () => {
    it('returns public user when credentials are valid', async () => {
      usersService.findByEmailWithPassword.mockResolvedValue(makeMockUser() as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser('test@example.com', 'correct-password');

      expect(result).not.toBeNull();
      expect(result).not.toHaveProperty('password');
      expect(result?.email).toBe('test@example.com');
      expect(result?.username).toBe('testuser');
      expect(result?.id).toBe(userId.toString());
    });

    it('returns null when password is incorrect', async () => {
      usersService.findByEmailWithPassword.mockResolvedValue(makeMockUser() as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await service.validateUser('test@example.com', 'wrong-password');

      expect(result).toBeNull();
    });

    it('returns null when user does not exist', async () => {
      usersService.findByEmailWithPassword.mockResolvedValue(null);

      const result = await service.validateUser('notfound@example.com', 'any');

      expect(result).toBeNull();
    });

    it('still runs bcrypt.compare when the user does not exist (timing equalized)', async () => {
      usersService.findByEmailWithPassword.mockResolvedValue(null);
      const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await service.validateUser('notfound@example.com', 'any');

      expect(result).toBeNull();
      // A dummy comparison keeps response time constant whether or not the
      // email exists, preventing user enumeration via timing.
      expect(compareSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it('returns access_token and public user info', async () => {
      const user = { id: userId.toString(), email: 'test@example.com', username: 'testuser' };

      const result = service.login(user);

      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.user).toEqual(user);
    });

    it('signs JWT with only sub in the payload', async () => {
      const user = { id: userId.toString(), email: 'test@example.com', username: 'testuser' };

      service.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({ sub: userId.toString() });
    });
  });

  describe('register', () => {
    it('creates a user and returns login result when the code is valid', async () => {
      usersService.create.mockResolvedValue(makeMockUser() as any);

      const result = await service.register(
        'test@example.com',
        'password123',
        'testuser',
        VALID_CODE,
      );

      expect(usersService.create).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        'testuser',
      );
      expect(result).toHaveProperty('access_token');
      expect(result.user.email).toBe('test@example.com');
    });

    it('rejects and does not create a user when the code is wrong', async () => {
      await expect(
        service.register('test@example.com', 'password123', 'testuser', 'wrong-code'),
      ).rejects.toThrow();

      expect(usersService.create).not.toHaveBeenCalled();
    });

    it('rejects when registration is disabled (REGISTRATION_CODE unset)', async () => {
      registrationCode = undefined;

      await expect(
        service.register('test@example.com', 'password123', 'testuser', VALID_CODE),
      ).rejects.toThrow();

      expect(usersService.create).not.toHaveBeenCalled();
    });
  });
});
