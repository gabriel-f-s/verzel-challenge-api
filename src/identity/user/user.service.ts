import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { CreateUser } from './interfaces/create-user.interface';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async create(data: CreateUser): Promise<User> {
    const userExists = await this.userRepository.findByEmail(data.email);
    if (userExists)
      throw new ConflictException('E-mail já cadastrado no sistema');
    return this.userRepository.create(data);
  }
}
