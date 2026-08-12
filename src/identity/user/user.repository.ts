import { Injectable } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { User } from 'src/identity/user/user.entity';
import { Role } from './enums/role.enum';
import { CreateUser } from './interfaces/create-user.interface';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user: PrismaUser | null = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async findById(id: string): Promise<User | null> {
    const user: PrismaUser | null = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async create(data: CreateUser): Promise<User> {
    const user: PrismaUser = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role,
      },
    });
    return this.mapToEntity(user);
  }

  private mapToEntity(user: PrismaUser): User {
    return new User({
      id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role as Role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
