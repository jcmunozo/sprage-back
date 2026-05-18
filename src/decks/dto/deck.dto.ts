import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDeckDto {
  @ApiProperty({ example: 'A1 Vocabulary', description: 'Deck name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Basic cards for A1 level' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateDeckDto extends PartialType(CreateDeckDto) {
  @ApiPropertyOptional({ description: 'Whether the deck is publicly visible' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class DeckResponseDto {
  @ApiProperty({ example: '6650f1c8e2a1b4d3f1234567' })
  _id: string;

  @ApiProperty({ example: 'A1 Vocabulary' })
  name: string;

  @ApiPropertyOptional({ example: 'Basic cards for A1 level' })
  description?: string;

  @ApiProperty({ example: '6650f1c8e2a1b4d3f1230000' })
  userId: string;

  @ApiProperty({ example: false })
  isPublic: boolean;

  @ApiProperty({ example: '2026-05-01T10:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-05-01T10:00:00.000Z' })
  updatedAt: string;
}
