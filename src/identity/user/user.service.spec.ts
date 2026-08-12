import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Role } from './enums/role.enum';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const mockUser = {
        id: '1',
        name: 'Test',
        email: 'test@test.com',
        role: Role.CLIENTE,
        createdAt: new Date(),
      };
      repository.findById.mockResolvedValue(mockUser as any);

      const result = await service.findById('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      repository.findByEmail.mockResolvedValue(null);
      const mockUser = {
        id: '1',
        name: 'Test',
        email: 'test@test.com',
        role: Role.CLIENTE,
        createdAt: new Date(),
      };
      repository.create.mockResolvedValue(mockUser as any);

      const result = await service.create({
        name: 'Test',
        email: 'test@test.com',
        passwordHash: 'hash',
        role: Role.CLIENTE,
      });
      expect(result).toEqual(mockUser);
      expect(repository.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email is already in use', async () => {
      repository.findByEmail.mockResolvedValue({ id: '2' } as any);

      await expect(
        service.create({
          name: 'Test',
          email: 'test@test.com',
          passwordHash: 'hash',
          role: Role.CLIENTE,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
