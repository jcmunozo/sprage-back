import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDeckDto {
  @ApiProperty({ example: 'A1 Vocabulary', description: 'Deck name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  name: string;

  @ApiPropertyOptional({ example: 'Basic cards for A1 level' })
  @IsOptional()
  @IsString()
  @MaxLength(512)
  description?: string;
}

export class UpdateDeckDto extends PartialType(CreateDeckDto) {}

export class DeckResponseDto {
  @ApiProperty({ example: '6650f1c8e2a1b4d3f1234567' })
  _id: string;

  @ApiProperty({ example: 'A1 Vocabulary' })
  name: string;

  @ApiPropertyOptional({ example: 'Basic cards for A1 level' })
  description?: string;

  @ApiProperty({ example: '6650f1c8e2a1b4d3f1230000' })
  userId: string;

  @ApiProperty({ example: '2026-05-01T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-05-01T10:00:00.000Z' })
  updatedAt: string;
}
