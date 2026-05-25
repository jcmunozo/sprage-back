import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { DueCardsResponseDto, ProgressResponseDto, RecordReviewDto } from './dto/progress.dto';

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
  getDue(@CurrentUser() user: AuthenticatedUser) {
    return this.progressService.getDueCards(user.id);
  }

  @Post('review')
  @ApiOperation({
    summary: 'Record a card review',
    description:
      'Applies the SM-2 algorithm: updates `easeFactor`, `interval`, `repetition` and computes `nextReviewDate`. ' +
      '`quality` must be an integer between 0 and 5.',
  })
  @ApiCreatedResponse({ type: ProgressResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid payload.' })
  @ApiNotFoundResponse({ description: 'Card not found or not owned by the user.' })
  recordReview(@CurrentUser() user: AuthenticatedUser, @Body() dto: RecordReviewDto) {
    return this.progressService.recordReview(user.id, dto.cardId, dto.quality);
  }
}
