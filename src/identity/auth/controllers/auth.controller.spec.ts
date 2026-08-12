import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { Role } from '../../user/models/enums/role.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn(),
      register: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register and return the result', async () => {
      const dto: RegisterDto = {
        name: 'Test',
        email: 'test@test.com',
        password: '123',
      };
      const expectedResult = {
        accessToken: 'token',
        user: {
          id: '1',
          name: 'Test',
          email: 'test@test.com',
          role: Role.CLIENTE,
          createdAt: new Date(),
        },
      };

      authService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(dto);
      expect(result).toEqual(expectedResult);
      expect(authService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should call authService.login and return the result', async () => {
      const dto: LoginDto = { email: 'test@test.com', password: '123' };
      const expectedResult = {
        accessToken: 'token',
        user: {
          id: '1',
          name: 'Test',
          email: 'test@test.com',
          role: Role.CLIENTE,
          createdAt: new Date(),
        },
      };

      authService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(dto);
      expect(result).toEqual(expectedResult);
      expect(authService.login).toHaveBeenCalledWith(dto);
    });
  });
});
