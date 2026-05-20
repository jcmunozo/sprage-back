import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
  AuthenticatedUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
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
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateLanguageDto) {
    return this.languagesService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: "List the user's languages" })
  @ApiOkResponse({ type: [LanguageResponseDto] })
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.languagesService.findAllByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a language by ID' })
  @ApiParam({ name: 'id', description: 'Language ID (ObjectId)' })
  @ApiOkResponse({ type: LanguageResponseDto })
  @ApiNotFoundResponse({ description: 'Language not found.' })
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.languagesService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a language' })
  @ApiParam({ name: 'id', description: 'Language ID (ObjectId)' })
  @ApiOkResponse({ type: LanguageResponseDto })
  @ApiNotFoundResponse({ description: 'Language not found.' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateLanguageDto,
  ) {
    return this.languagesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a language',
    description:
      'Cascades: removes all links pointing to this language and nullifies languageId on cards that reference it.',
  })
  @ApiParam({ name: 'id', description: 'Language ID (ObjectId)' })
  @ApiOkResponse({ schema: { example: { message: 'Language removed' } } })
  @ApiNotFoundResponse({ description: 'Language not found.' })
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.languagesService.remove(id, user.id);
  }
}
