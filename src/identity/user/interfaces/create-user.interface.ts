import { Role } from '../enums/role.enum';

export interface CreateUser {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
}
