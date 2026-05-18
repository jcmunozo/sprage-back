import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  DueCardsResponseDto,
  ProgressResponseDto,
  RecordReviewDto,
} from './dto/progress.dto';

@ApiTags('Progress')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('due')
  @ApiOperation({
    summary: 'Get due and new cards',
    description:
      'Returns two lists: `due` (reviews whose date has already expired) and `new` (cards the user has never studied).',
  })
  @ApiOkResponse({ type: DueCardsResponseDto })
  getDue(@Request() req: any) {
    return this.progressService.getDueCards(req.user.id);
  }

  @Post('review')
  @ApiOperation({
    summary: 'Record a card review',
    description:
      'Applies the SM-2 algorithm: updates `easeFactor`, `interval`, `repetition` and computes `nextReviewDate`. ' +
      '`quality` must be an integer between 0 and 5.',
  })
  @ApiCreatedResponse({ type: ProgressResponseDto })
  @ApiBadRequestResponse({ description: 'Missing cardId or quality out of range (0–5).' })
  recordReview(@Request() req: any, @Body() body: RecordReviewDto) {
    const { cardId, quality } = body;
    if (!cardId) {
      throw new BadRequestException('cardId is required');
    }
    if (
      quality === undefined ||
      quality === null ||
      !Number.isInteger(quality) ||
      quality < 0 ||
      quality > 5
    ) {
      throw new BadRequestException('quality must be an integer between 0 and 5');
    }
    return this.progressService.recordReview(req.user.id, cardId, quality);
  }
}
