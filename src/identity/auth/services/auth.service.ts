import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../dto/register.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../../user/models/enums/role.enum';
import { LoginDto } from '../dto/login.dto';
import { User } from '../../user/models/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(request: LoginDto): Promise<AuthResponseDto> {
    const user: User | null = await this.userService.findByEmail(request.email);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const isPasswordValid = await bcrypt.compare(
      request.password,
      user.passwordHash,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Credenciais inválidas');

    return this.generateAuthResponse(user);
  }

  async register(request: RegisterDto): Promise<AuthResponseDto> {
    const passwordHash: string = await bcrypt.hash(request.password, 10);
    const user = await this.userService.create({
      name: request.name,
      email: request.email,
      passwordHash,
      role: request.role ?? Role.CLIENTE,
    });
    return this.generateAuthResponse(user);
  }

  private generateAuthResponse(user: {
    id: string;
    email: string;
    name: string;
    role: Role;
    createdAt: Date;
  }): AuthResponseDto {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }
}
