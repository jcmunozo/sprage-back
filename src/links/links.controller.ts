import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LinksService } from './links.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateLinkDto, LinkResponseDto, UpdateLinkDto } from './dto/link.dto';

@ApiTags('Links')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'JWT ausente o inválido.' })
@Controller('links')
@UseGuards(JwtAuthGuard)
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un enlace asociado a un idioma' })
  @ApiCreatedResponse({ type: LinkResponseDto })
  create(@Request() req: any, @Body() createLinkDto: CreateLinkDto) {
    return this.linksService.create(req.user.id, createLinkDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar enlaces del usuario',
    description: 'Si se pasa `languageId` filtra solo los enlaces de ese idioma.',
  })
  @ApiQuery({ name: 'languageId', required: false, description: 'Filtrar por idioma (ObjectId)' })
  @ApiOkResponse({ type: [LinkResponseDto] })
  findAll(@Request() req: any, @Query('languageId') languageId?: string) {
    if (languageId) {
      return this.linksService.findByLanguage(req.user.id, languageId);
    }
    return this.linksService.findAllByUser(req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar url o descripción de un enlace' })
  @ApiParam({ name: 'id', description: 'ID del enlace (ObjectId)' })
  @ApiOkResponse({ type: LinkResponseDto })
  @ApiNotFoundResponse({ description: 'Enlace no encontrado.' })
  update(@Request() req: any, @Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.update(id, req.user.id, updateLinkDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un enlace' })
  @ApiParam({ name: 'id', description: 'ID del enlace (ObjectId)' })
  @ApiOkResponse({ schema: { example: { message: 'Link removed' } } })
  @ApiNotFoundResponse({ description: 'Enlace no encontrado.' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.linksService.remove(id, req.user.id);
  }
}
