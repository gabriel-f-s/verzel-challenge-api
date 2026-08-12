import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '../user/enums/role.enum';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockUserService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a token and user data on successful login', async () => {
      const mockUser = {
        id: '1',
        name: 'Test',
        email: 'test@test.com',
        role: Role.CLIENTE,
        passwordHash: 'hashed',
        createdAt: new Date(),
      };
      userService.findByEmail.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('valid_token');

      const result = await service.login({
        email: 'test@test.com',
        password: 'password',
      });

      expect(result).toBeDefined();
      expect(result.accessToken).toBe('valid_token');
      expect(result.user.email).toBe('test@test.com');
      expect(userService.findByEmail).toHaveBeenCalledWith('test@test.com');
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      userService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'test@test.com', password: 'password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const mockUser = {
        id: '1',
        name: 'Test',
        email: 'test@test.com',
        role: Role.CLIENTE,
        passwordHash: 'hashed',
        createdAt: new Date(),
      };
      userService.findByEmail.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create a user and return token and user data', async () => {
      const mockUser = {
        id: '1',
        name: 'Test',
        email: 'test@test.com',
        role: Role.CLIENTE,
        passwordHash: 'hashed',
        createdAt: new Date(),
      };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      userService.create.mockResolvedValue(mockUser as any);
      jwtService.sign.mockReturnValue('valid_token');

      const result = await service.register({
        name: 'Test',
        email: 'test@test.com',
        password: 'password',
        role: Role.CLIENTE,
      });

      expect(result).toBeDefined();
      expect(result.accessToken).toBe('valid_token');
      expect(userService.create).toHaveBeenCalledWith({
        name: 'Test',
        email: 'test@test.com',
        passwordHash: 'hashed',
        role: Role.CLIENTE,
      });
    });
  });
});
