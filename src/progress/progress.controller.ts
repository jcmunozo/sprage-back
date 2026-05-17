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
@ApiUnauthorizedResponse({ description: 'JWT ausente o inválido.' })
@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('due')
  @ApiOperation({
    summary: 'Obtener tarjetas pendientes y nuevas',
    description:
      'Devuelve dos listas: `due` (revisiones cuya fecha ya venció) y `new` (tarjetas que el usuario nunca ha estudiado).',
  })
  @ApiOkResponse({ type: DueCardsResponseDto })
  getDue(@Request() req: any) {
    return this.progressService.getDueCards(req.user.id);
  }

  @Post('review')
  @ApiOperation({
    summary: 'Registrar la revisión de una tarjeta',
    description:
      'Aplica el algoritmo SM-2: ajusta `easeFactor`, `interval`, `repetition` y calcula `nextReviewDate`. ' +
      '`quality` debe ser un entero 0–5.',
  })
  @ApiCreatedResponse({ type: ProgressResponseDto })
  @ApiBadRequestResponse({ description: 'cardId faltante o quality fuera de rango (0–5).' })
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
