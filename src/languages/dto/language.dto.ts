import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateLanguageDto {
  @ApiProperty({ example: 'English', description: 'Language name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  name: string;

  @ApiPropertyOptional({ example: 'en', description: 'ISO 639-1 code' })
  @IsOptional()
  @IsString()
  @MaxLength(8)
  code?: string;
}

export class UpdateLanguageDto extends PartialType(CreateLanguageDto) {}

export class LanguageResponseDto {
  @ApiProperty({ example: '6650f1c8e2a1b4d3f1234567' })
  _id: string;

  @ApiProperty({ example: '6650f1c8e2a1b4d3f1230000' })
  userId: string;

  @ApiProperty({ example: 'English' })
  name: string;

  @ApiPropertyOptional({ example: 'en' })
  code?: string;
}
