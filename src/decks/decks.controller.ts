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
import { DecksService } from './decks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateDeckDto, DeckResponseDto, UpdateDeckDto } from './dto/deck.dto';

@ApiTags('Decks')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'JWT ausente o inválido.' })
@Controller('decks')
@UseGuards(JwtAuthGuard)
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un mazo para el usuario autenticado' })
  @ApiCreatedResponse({ type: DeckResponseDto })
  create(@Request() req: any, @Body() body: CreateDeckDto) {
    const { name, description } = body;
    return this.decksService.create(req.user.id, name, description);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los mazos del usuario' })
  @ApiOkResponse({ type: [DeckResponseDto] })
  findAll(@Request() req: any) {
    return this.decksService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un mazo por ID' })
  @ApiParam({ name: 'id', description: 'ID del mazo (ObjectId)' })
  @ApiOkResponse({ type: DeckResponseDto })
  @ApiNotFoundResponse({ description: 'Mazo no encontrado o no pertenece al usuario.' })
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.decksService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar parcialmente un mazo' })
  @ApiParam({ name: 'id', description: 'ID del mazo (ObjectId)' })
  @ApiOkResponse({ type: DeckResponseDto })
  @ApiNotFoundResponse({ description: 'Mazo no encontrado.' })
  update(@Request() req: any, @Param('id') id: string, @Body() updateDeckDto: UpdateDeckDto) {
    return this.decksService.update(id, req.user.id, updateDeckDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un mazo' })
  @ApiParam({ name: 'id', description: 'ID del mazo (ObjectId)' })
  @ApiOkResponse({ schema: { example: { message: 'Deck removed' } } })
  @ApiNotFoundResponse({ description: 'Mazo no encontrado.' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.decksService.remove(id, req.user.id);
  }
}
