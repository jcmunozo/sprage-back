import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCardDto {
  @ApiProperty({ example: 'hello', description: 'Card front side' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  front: string;

  @ApiProperty({ example: 'hola', description: 'Card back side' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  back: string;

  @ApiPropertyOptional({
    example: '6650f1c8e2a1b4d3f1234567',
    description: 'Deck this card belongs to (must belong to the requesting user)',
  })
  @IsOptional()
  @IsMongoId()
  deckId?: string;

  @ApiPropertyOptional({
    example: '6650f1c8e2a1b4d3f1234aaa',
    description: 'Language this card belongs to (must belong to the requesting user)',
  })
  @IsOptional()
  @IsMongoId()
  languageId?: string;

  @ApiPropertyOptional({
    example: 'vocabulary',
    description: 'Card type (vocabulary, grammar, idiom...)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  type?: string;

  @ApiPropertyOptional({ example: 'greetings' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  category?: string;

  @ApiPropertyOptional({ example: 'Hello, how are you?' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  example?: string;

  @ApiPropertyOptional({ example: 'beginner' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  difficulty?: string;

  @ApiPropertyOptional({ type: [String], example: ['noun', 'beginner'] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(32)
  @IsString({ each: true })
  @MaxLength(64, { each: true })
  tags?: string[];
}

export class UpdateCardDto extends PartialType(CreateCardDto) {}

export class ImportCardItemDto extends PartialType(CreateCardDto) {
  @ApiProperty({ example: 'hello' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  front: string;

  @ApiProperty({ example: 'hola' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  back: string;
}

export class ImportCardsDto {
  @ApiProperty({
    type: [ImportCardItemDto],
    description: 'List of cards to import. Duplicates by (front, back) pair are skipped.',
  })
  @IsArray()
  @ArrayMaxSize(1000)
  @ValidateNested({ each: true })
  @Type(() => ImportCardItemDto)
  cards: ImportCardItemDto[];
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

  @ApiPropertyOptional({ example: '6650f1c8e2a1b4d3f1230222' })
  languageId?: string;

  @ApiProperty({ example: 'hello' })
  front: string;

  @ApiProperty({ example: 'hola' })
  back: string;

  @ApiPropertyOptional({ example: 'vocabulary' })
  type?: string;

  @ApiPropertyOptional({ example: 'greetings' })
  category?: string;

  @ApiPropertyOptional({ example: 'Hello, how are you?' })
  example?: string;

  @ApiPropertyOptional({ example: 'beginner' })
  difficulty?: string;

  @ApiPropertyOptional({ type: [String], example: ['noun'] })
  tags?: string[];

  @ApiProperty({ example: '2026-05-01T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-05-01T10:00:00.000Z' })
  updatedAt: string;
}
