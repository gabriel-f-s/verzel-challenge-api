import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Retorna o perfil do usuário logado via token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou ausente' })
  async getProfile(
    @CurrentUser('id') userId: string,
  ): Promise<UserResponseDto> {
    return this.userService.findById(userId);
  }
}
