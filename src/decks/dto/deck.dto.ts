import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDeckDto {
  @ApiProperty({ example: 'Vocabulario A1', description: 'Nombre del mazo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Tarjetas básicas para nivel A1' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateDeckDto extends PartialType(CreateDeckDto) {
  @ApiPropertyOptional({ description: 'Si el mazo es visible públicamente' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class DeckResponseDto {
  @ApiProperty({ example: '6650f1c8e2a1b4d3f1234567' })
  _id: string;

  @ApiProperty({ example: 'Vocabulario A1' })
  name: string;

  @ApiPropertyOptional({ example: 'Tarjetas básicas para nivel A1' })
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
