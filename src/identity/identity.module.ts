import { Module } from '@nestjs/common';
import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';
import { AuthController } from './controllers/auth.controller';
import { UserRepository } from './repositories/user.repository';

@Module({
  providers: [AuthService, UserService, UserRepository],
  controllers: [AuthController],
})
export class IdentityModule {}
