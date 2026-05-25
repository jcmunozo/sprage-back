import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

// A pre-computed valid bcrypt hash (cost 12). Compared against when no user is
// found so that login takes the same time whether or not the email exists,
// preventing user enumeration via response timing.
const DUMMY_HASH = '$2b$12$8tkmnu6rTIcBQvymFGF7S.6yf/Yg7.z5Es0sK25Phakg2wvtbK9a.';

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
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<PublicUser | null> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      // Run a comparison against a dummy hash to keep timing constant.
      await bcrypt.compare(pass, DUMMY_HASH);
      return null;
    }
    if (await bcrypt.compare(pass, user.password)) {
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

  async register(
    email: string,
    pass: string,
    username: string,
    registrationCode: string,
  ): Promise<AuthResult> {
    // Invite-only registration: REGISTRATION_CODE must be configured and the
    // request must present the matching code. If unset, registration is
    // disabled (fail closed) so a misconfigured deploy is never left open.
    const expectedCode = this.configService.get<string>('REGISTRATION_CODE');
    if (!expectedCode) {
      throw new ForbiddenException('Registration is disabled');
    }
    if (registrationCode !== expectedCode) {
      throw new ForbiddenException('Invalid registration code');
    }

    const created: UserDocument = await this.usersService.create(email, pass, username);
    return this.login({
      id: created._id.toString(),
      email: created.email,
      username: created.username,
    });
  }
}
