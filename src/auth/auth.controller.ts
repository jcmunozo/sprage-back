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
    summary: 'Registrar un nuevo usuario',
    description: 'Crea una cuenta y devuelve un JWT listo para usar. El email debe ser único.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ type: AuthResponseDto, description: 'Usuario creado; access_token emitido.' })
  @ApiBadRequestResponse({ description: 'Faltan email, password o username.' })
  @ApiConflictResponse({ description: 'Ya existe un usuario con ese email.' })
  async register(@Body() body: RegisterDto) {
    const { email, password, username } = body;
    if (!email || !password || !username) {
      throw new BadRequestException('Email, password and username are required');
    }
    return this.authService.register(email, password, username);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Valida credenciales y devuelve un JWT con expiración de 1 día.',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: AuthResponseDto, description: 'Credenciales válidas; access_token emitido.' })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas.' })
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
