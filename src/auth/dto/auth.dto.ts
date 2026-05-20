import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'jane@example.com', description: 'Unique user email' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd!2026',
    minLength: 8,
    maxLength: 128,
    description: 'Plain-text password; stored hashed with bcrypt',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @ApiProperty({ example: 'jane', description: 'Display username' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  username: string;
}

export class LoginDto {
  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'P@ssw0rd!2026' })
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
    description: 'JWT with 1-day expiration. Use as a Bearer token.',
  })
  access_token: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}
