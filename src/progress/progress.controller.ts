import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
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
    return this.progressService.recordReview(req.user.id, cardId, quality);
  }
}
