import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../user/enums/role.enum';

export class RegisterDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Nome completo do usuário',
  })
  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name!: string;

  @ApiProperty({
    example: 'johndoe@verzel.com',
    description: 'E-mail para login',
  })
  @IsEmail({}, { message: 'Formato de e-mail inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Senha de acesso (mínimo 6 caracteres)',
  })
  @IsString()
  @MinLength(6, { message: 'A senha deve conter no mínimo 6 caracteres' })
  password!: string;

  @ApiPropertyOptional({
    enum: Role,
    default: Role.CLIENTE,
    description: 'Papel do usuário no sistema',
  })
  @IsEnum(Role, { message: 'Role inválida' })
  @IsOptional()
  role?: Role = Role.CLIENTE;
}
