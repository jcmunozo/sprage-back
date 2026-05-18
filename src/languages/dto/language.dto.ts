import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLanguageDto {
  @ApiProperty({ example: 'English', description: 'Language name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'en', description: 'ISO 639-1 code' })
  @IsOptional()
  @IsString()
  code?: string;
}

export class UpdateLanguageDto extends PartialType(CreateLanguageDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class LanguageResponseDto {
  @ApiProperty({ example: '6650f1c8e2a1b4d3f1234567' })
  _id: string;

  @ApiProperty({ example: '6650f1c8e2a1b4d3f1230000' })
  userId: string;

  @ApiProperty({ example: 'English' })
  name: string;

  @ApiPropertyOptional({ example: 'en' })
  code?: string;

  @ApiProperty({ example: true })
  isActive: boolean;
}
