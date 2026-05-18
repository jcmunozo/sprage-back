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
@ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
@Controller('languages')
@UseGuards(JwtAuthGuard)
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a language for the user' })
  @ApiCreatedResponse({ type: LanguageResponseDto })
  create(@Request() req: any, @Body() body: CreateLanguageDto) {
    const { name, code } = body;
    return this.languagesService.create(req.user.id, name, code);
  }

  @Get()
  @ApiOperation({ summary: "List the user's languages" })
  @ApiOkResponse({ type: [LanguageResponseDto] })
  findAll(@Request() req: any) {
    return this.languagesService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a language by ID' })
  @ApiParam({ name: 'id', description: 'Language ID (ObjectId)' })
  @ApiOkResponse({ type: LanguageResponseDto })
  @ApiNotFoundResponse({ description: 'Language not found.' })
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.languagesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a language' })
  @ApiParam({ name: 'id', description: 'Language ID (ObjectId)' })
  @ApiOkResponse({ type: LanguageResponseDto })
  @ApiNotFoundResponse({ description: 'Language not found.' })
  update(@Request() req: any, @Param('id') id: string, @Body() body: UpdateLanguageDto) {
    return this.languagesService.update(id, req.user.id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a language' })
  @ApiParam({ name: 'id', description: 'Language ID (ObjectId)' })
  @ApiOkResponse({ schema: { example: { message: 'Language removed' } } })
  @ApiNotFoundResponse({ description: 'Language not found.' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.languagesService.remove(id, req.user.id);
  }
}
