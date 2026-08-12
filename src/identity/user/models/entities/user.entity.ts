import { Role } from '../enums/role.enum';

export class User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    this.id = partial.id ?? '';
    this.name = partial.name ?? '';
    this.email = partial.email ?? '';
    this.passwordHash = partial.passwordHash ?? '';
    this.role = partial.role ?? Role.ORGANIZADOR;
    this.createdAt = partial.createdAt ?? new Date();
    this.updatedAt = partial.updatedAt ?? new Date();
  }
}
