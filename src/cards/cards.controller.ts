import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CardsService } from './cards.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CardResponseDto,
  CreateCardDto,
  ImportCardsDto,
  ImportCardsResponseDto,
  UpdateCardDto,
} from './dto/card.dto';

@ApiTags('Cards')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'JWT ausente o inválido.' })
@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear una tarjeta',
    description: 'El schema admite campos extra (strict: false); cualquier propiedad adicional se persiste.',
  })
  @ApiCreatedResponse({ type: CardResponseDto })
  create(@Request() req: any, @Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(req.user.id, createCardDto);
  }

  @Post('import')
  @ApiOperation({
    summary: 'Importar tarjetas en bloque',
    description:
      'Inserta varias tarjetas en una sola llamada. Se omiten las duplicadas por par (front, back) ya existentes para el usuario.',
  })
  @ApiCreatedResponse({ type: ImportCardsResponseDto })
  import(@Request() req: any, @Body() body: ImportCardsDto) {
    return this.cardsService.importCards(req.user.id, body.cards ?? []);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tarjetas del usuario' })
  @ApiOkResponse({ type: [CardResponseDto] })
  findAll(@Request() req: any) {
    return this.cardsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarjeta por ID' })
  @ApiParam({ name: 'id', description: 'ID de la tarjeta (ObjectId)' })
  @ApiOkResponse({ type: CardResponseDto })
  @ApiNotFoundResponse({ description: 'Tarjeta no encontrada.' })
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.cardsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar parcialmente una tarjeta' })
  @ApiParam({ name: 'id', description: 'ID de la tarjeta (ObjectId)' })
  @ApiOkResponse({ type: CardResponseDto })
  @ApiNotFoundResponse({ description: 'Tarjeta no encontrada.' })
  update(@Request() req: any, @Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(id, req.user.id, updateCardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una tarjeta' })
  @ApiParam({ name: 'id', description: 'ID de la tarjeta (ObjectId)' })
  @ApiOkResponse({ schema: { example: { message: 'Card removed' } } })
  @ApiNotFoundResponse({ description: 'Tarjeta no encontrada.' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.cardsService.remove(id, req.user.id);
  }
}
