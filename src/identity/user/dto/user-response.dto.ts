import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../models/enums/role.enum';

export class UserResponseDto {
  @ApiProperty({ example: 'd31f722d-d089-4b27-8db8-173939dac68c' })
  id!: string;

  @ApiProperty({ example: 'John Doe' })
  name!: string;

  @ApiProperty({ example: 'johndoe@verzel.com' })
  email!: string;

  @ApiProperty({ enum: Role, example: Role.CLIENTE })
  role!: Role;

  @ApiProperty()
  createdAt!: Date;
}
