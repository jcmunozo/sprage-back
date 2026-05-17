import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCardDto {
  @ApiProperty({ example: 'casa', description: 'Anverso de la tarjeta' })
  @IsString()
  @IsNotEmpty()
  front: string;

  @ApiProperty({ example: 'house', description: 'Reverso de la tarjeta' })
  @IsString()
  @IsNotEmpty()
  back: string;

  @ApiPropertyOptional({ example: '6650f1c8e2a1b4d3f1234567', description: 'Mazo al que pertenece' })
  @IsOptional()
  @IsMongoId()
  deckId?: string;

  @ApiPropertyOptional({ example: 'vocabulary', description: 'Tipo de tarjeta (vocabulary, grammar, idiom...)' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'en' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ example: 'home' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'I am going home.' })
  @IsOptional()
  @IsString()
  example?: string;

  @ApiPropertyOptional({ type: [String], example: ['noun', 'beginner'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class UpdateCardDto extends PartialType(CreateCardDto) {}

export class ImportCardsDto {
  @ApiProperty({
    type: [CreateCardDto],
    description: 'Lista de tarjetas a importar. Las duplicadas por (front, back) se omiten.',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCardDto)
  cards: CreateCardDto[];
}

export class ImportCardsResponseDto {
  @ApiProperty({ example: 'Cards import complete' })
  message: string;

  @ApiProperty({ example: 42, description: 'Número de tarjetas efectivamente insertadas' })
  importedCount: number;
}

export class CardResponseDto {
  @ApiProperty({ example: '6650f1c8e2a1b4d3f1234567' })
  _id: string;

  @ApiProperty({ example: '6650f1c8e2a1b4d3f1230000' })
  userId: string;

  @ApiPropertyOptional({ example: '6650f1c8e2a1b4d3f1230111' })
  deckId?: string;

  @ApiProperty({ example: 'casa' })
  front: string;

  @ApiProperty({ example: 'house' })
  back: string;

  @ApiPropertyOptional({ example: 'vocabulary' })
  type?: string;

  @ApiPropertyOptional({ example: 'en' })
  language?: string;

  @ApiPropertyOptional({ example: 'home' })
  category?: string;

  @ApiPropertyOptional({ example: 'I am going home.' })
  example?: string;

  @ApiPropertyOptional({ type: [String], example: ['noun'] })
  tags?: string[];

  @ApiProperty({ example: '2026-05-01T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-05-01T10:00:00.000Z' })
  updatedAt: string;
}
