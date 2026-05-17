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
import { LanguagesService } from './languages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateLanguageDto,
  LanguageResponseDto,
  UpdateLanguageDto,
} from './dto/language.dto';

@ApiTags('Languages')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'JWT ausente o inválido.' })
@Controller('languages')
@UseGuards(JwtAuthGuard)
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un idioma para el usuario' })
  @ApiCreatedResponse({ type: LanguageResponseDto })
  create(@Request() req: any, @Body() body: CreateLanguageDto) {
    const { name, code } = body;
    return this.languagesService.create(req.user.id, name, code);
  }

  @Get()
  @ApiOperation({ summary: 'Listar idiomas del usuario' })
  @ApiOkResponse({ type: [LanguageResponseDto] })
  findAll(@Request() req: any) {
    return this.languagesService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un idioma por ID' })
  @ApiParam({ name: 'id', description: 'ID del idioma (ObjectId)' })
  @ApiOkResponse({ type: LanguageResponseDto })
  @ApiNotFoundResponse({ description: 'Idioma no encontrado.' })
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.languagesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar parcialmente un idioma' })
  @ApiParam({ name: 'id', description: 'ID del idioma (ObjectId)' })
  @ApiOkResponse({ type: LanguageResponseDto })
  @ApiNotFoundResponse({ description: 'Idioma no encontrado.' })
  update(@Request() req: any, @Param('id') id: string, @Body() body: UpdateLanguageDto) {
    return this.languagesService.update(id, req.user.id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un idioma' })
  @ApiParam({ name: 'id', description: 'ID del idioma (ObjectId)' })
  @ApiOkResponse({ schema: { example: { message: 'Language removed' } } })
  @ApiNotFoundResponse({ description: 'Idioma no encontrado.' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.languagesService.remove(id, req.user.id);
  }
}
