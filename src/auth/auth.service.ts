import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

export interface PublicUser {
  id: string;
  email: string;
  username: string;
}

export interface AuthResult {
  access_token: string;
  user: PublicUser;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<PublicUser | null> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return { id: user._id.toString(), email: user.email, username: user.username };
    }
    return null;
  }

  login(user: PublicUser): AuthResult {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(email: string, pass: string, username: string): Promise<AuthResult> {
    const created: UserDocument = await this.usersService.create(email, pass, username);
    return this.login({
      id: created._id.toString(),
      email: created.email,
      username: created.username,
    });
  }
}
