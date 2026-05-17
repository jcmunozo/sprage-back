import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsMongoId, Max, Min } from 'class-validator';
import { CardResponseDto } from '../../cards/dto/card.dto';

export class RecordReviewDto {
  @ApiProperty({ example: '6650f1c8e2a1b4d3f1234567', description: 'ID de la tarjeta revisada' })
  @IsMongoId()
  cardId: string;

  @ApiProperty({
    example: 4,
    minimum: 0,
    maximum: 5,
    description:
      'Calidad de la respuesta en escala SM-2. 0–2: incorrecto (lapsed); 3–5: correcto. ' +
      'Determina próximo intervalo, ease factor y estado.',
  })
  @IsInt()
  @Min(0)
  @Max(5)
  quality: number;
}

export class ProgressResponseDto {
  @ApiProperty({ example: '6650f1c8e2a1b4d3f1234567' })
  _id: string;

  @ApiProperty({ example: '6650f1c8e2a1b4d3f1230000' })
  userId: string;

  @ApiProperty({ example: '6650f1c8e2a1b4d3f1230111' })
  cardId: string;

  @ApiProperty({ example: 3, description: 'Número de repeticiones consecutivas correctas' })
  repetition: number;

  @ApiProperty({ example: 2.5, description: 'Factor de facilidad (mínimo 1.3)' })
  easeFactor: number;

  @ApiProperty({ example: 6, description: 'Intervalo en días hasta la próxima revisión' })
  interval: number;

  @ApiProperty({ example: '2026-05-22T10:00:00.000Z' })
  nextReviewDate: string;

  @ApiProperty({ enum: ['new', 'learning', 'graduated', 'lapsed'], example: 'learning' })
  status: string;
}

export class DueCardsResponseDto {
  @ApiProperty({
    type: [ProgressResponseDto],
    description: 'Tarjetas con revisión vencida (nextReviewDate ≤ ahora). El campo cardId viene poblado con la tarjeta.',
  })
  due: ProgressResponseDto[];

  @ApiProperty({
    type: [CardResponseDto],
    description: 'Tarjetas que el usuario aún no ha estudiado (sin Progress asociado)',
  })
  new: CardResponseDto[];
}
