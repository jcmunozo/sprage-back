import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

// Excluded from the OpenAPI spec: the auth/register and auth/login endpoints
// are not published in Swagger UI or /api/docs-json. The routes still work;
// they are just not advertised in the API documentation.
@ApiExcludeController()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Throttle({ auth: { limit: 5, ttl: 60_000 } })
  async register(@Body() body: RegisterDto) {
    return this.authService.register(
      body.email,
      body.password,
      body.username,
      body.registrationCode,
    );
  }

  @Post('login')
  @Throttle({ auth: { limit: 5, ttl: 60_000 } })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
