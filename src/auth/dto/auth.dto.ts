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

  @ApiProperty({ description: 'Invitation code required to register (matches REGISTRATION_CODE)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  registrationCode: string;
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
