import { Controller, Get, Post, Body, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('due')
  getDue(@Request() req: any) {
    return this.progressService.getDueCards(req.user.id);
  }

  @Post('review')
  recordReview(@Request() req: any, @Body() body: any) {
    const { cardId, quality } = body;
    if (!cardId) {
      throw new BadRequestException('cardId is required');
    }
    if (quality === undefined || quality === null || !Number.isInteger(quality) || quality < 0 || quality > 5) {
      throw new BadRequestException('quality must be an integer between 0 and 5');
    }
    return this.progressService.recordReview(req.user.id, cardId, quality);
  }
}
