import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto, LoginDto, RegisterDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates an account and returns a ready-to-use JWT. The email must be unique.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ type: AuthResponseDto, description: 'User created; access_token issued.' })
  @ApiBadRequestResponse({ description: 'Missing email, password or username.' })
  @ApiConflictResponse({ description: 'A user with that email already exists.' })
  async register(@Body() body: RegisterDto) {
    const { email, password, username } = body;
    if (!email || !password || !username) {
      throw new BadRequestException('Email, password and username are required');
    }
    return this.authService.register(email, password, username);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Log in',
    description: 'Validates credentials and returns a JWT with 1-day expiration.',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: AuthResponseDto, description: 'Valid credentials; access_token issued.' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
