import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsMongoId, Max, Min } from 'class-validator';
import { CardResponseDto } from '../../cards/dto/card.dto';

export class RecordReviewDto {
  @ApiProperty({ example: '6650f1c8e2a1b4d3f1234567', description: 'ID of the reviewed card' })
  @IsMongoId()
  cardId: string;

  @ApiProperty({
    example: 4,
    minimum: 0,
    maximum: 5,
    description:
      'Answer quality on the SM-2 scale. 0–2: incorrect (lapsed); 3–5: correct. ' +
      'Determines the next interval, ease factor and status.',
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

  @ApiProperty({ example: 3, description: 'Number of consecutive correct repetitions' })
  repetition: number;

  @ApiProperty({ example: 2.5, description: 'Ease factor (minimum 1.3)' })
  easeFactor: number;

  @ApiProperty({ example: 6, description: 'Interval in days until next review' })
  interval: number;

  @ApiProperty({ example: '2026-05-22T10:00:00.000Z' })
  nextReviewDate: string;

  @ApiProperty({ enum: ['new', 'learning', 'graduated', 'lapsed'], example: 'learning' })
  status: string;
}

export class DueCardsResponseDto {
  @ApiProperty({
    type: [ProgressResponseDto],
    description:
      'Cards with overdue review (nextReviewDate ≤ now). The cardId field is populated with the card.',
  })
  due: ProgressResponseDto[];

  @ApiProperty({
    type: [CardResponseDto],
    description: 'Cards the user has not studied yet (no associated Progress record)',
  })
  new: CardResponseDto[];
}
