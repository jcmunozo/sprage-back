import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'jane@example.com', description: 'Email único del usuario' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'P@ssw0rd!', minLength: 6, description: 'Contraseña en texto plano; se almacena con bcrypt' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'jane', description: 'Nombre de usuario visible' })
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class LoginDto {
  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'P@ssw0rd!' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthUserDto {
  @ApiProperty({ example: '6650f1c8e2a1b4d3f1234567' })
  id: string;

  @ApiProperty({ example: 'jane@example.com' })
  email: string;

  @ApiProperty({ example: 'jane' })
  username: string;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT con expiración de 1 día. Usar como Bearer token.',
  })
  access_token: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}
