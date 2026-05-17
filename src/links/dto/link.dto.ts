import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { LanguageResponseDto } from '../../languages/dto/language.dto';

export class CreateLinkDto {
  @ApiProperty({ example: 'https://example.com/grammar', description: 'URL del recurso' })
  @IsUrl()
  url: string;

  @ApiPropertyOptional({ example: 'Guía de gramática inglesa' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '6650f1c8e2a1b4d3f1234567', description: 'ID del idioma asociado' })
  @IsMongoId()
  @IsNotEmpty()
  languageId: string;
}

export class UpdateLinkDto {
  @ApiPropertyOptional({ example: 'https://example.com/new-url' })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiPropertyOptional({ example: 'Nueva descripción' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class LinkResponseDto {
  @ApiProperty({ example: '6650f1c8e2a1b4d3f1234567' })
  _id: string;

  @ApiProperty({ example: '6650f1c8e2a1b4d3f1230000' })
  userId: string;

  @ApiProperty({ example: 'https://example.com/grammar' })
  url: string;

  @ApiPropertyOptional({ example: 'Guía de gramática inglesa' })
  description?: string;

  @ApiProperty({ type: LanguageResponseDto, description: 'Idioma poblado por populate()' })
  languageId: LanguageResponseDto;

  @ApiProperty({ example: '2026-05-01T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-05-01T10:00:00.000Z' })
  updatedAt: string;
}
