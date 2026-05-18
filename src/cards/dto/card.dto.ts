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
  @ApiProperty({ example: 'hello', description: 'Card front side' })
  @IsString()
  @IsNotEmpty()
  front: string;

  @ApiProperty({ example: 'hola', description: 'Card back side' })
  @IsString()
  @IsNotEmpty()
  back: string;

  @ApiPropertyOptional({
    example: '6650f1c8e2a1b4d3f1234567',
    description: 'Deck this card belongs to',
  })
  @IsOptional()
  @IsMongoId()
  deckId?: string;

  @ApiPropertyOptional({
    example: 'vocabulary',
    description: 'Card type (vocabulary, grammar, idiom...)',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 'es' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ example: 'greetings' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'Hello, how are you?' })
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
    description: 'List of cards to import. Duplicates by (front, back) pair are skipped.',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCardDto)
  cards: CreateCardDto[];
}

export class ImportCardsResponseDto {
  @ApiProperty({ example: 'Cards import complete' })
  message: string;

  @ApiProperty({ example: 42, description: 'Number of cards actually inserted' })
  importedCount: number;
}

export class CardResponseDto {
  @ApiProperty({ example: '6650f1c8e2a1b4d3f1234567' })
  _id: string;

  @ApiProperty({ example: '6650f1c8e2a1b4d3f1230000' })
  userId: string;

  @ApiPropertyOptional({ example: '6650f1c8e2a1b4d3f1230111' })
  deckId?: string;

  @ApiProperty({ example: 'hello' })
  front: string;

  @ApiProperty({ example: 'hola' })
  back: string;

  @ApiPropertyOptional({ example: 'vocabulary' })
  type?: string;

  @ApiPropertyOptional({ example: 'es' })
  language?: string;

  @ApiPropertyOptional({ example: 'greetings' })
  category?: string;

  @ApiPropertyOptional({ example: 'Hello, how are you?' })
  example?: string;

  @ApiPropertyOptional({ type: [String], example: ['noun'] })
  tags?: string[];

  @ApiProperty({ example: '2026-05-01T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-05-01T10:00:00.000Z' })
  updatedAt: string;
}
