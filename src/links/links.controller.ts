import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
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
import {
  AuthenticatedUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
import { CreateLinkDto, LinkResponseDto, UpdateLinkDto } from './dto/link.dto';

@ApiTags('Links')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
@Controller('links')
@UseGuards(JwtAuthGuard)
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a link associated with a language' })
  @ApiCreatedResponse({ type: LinkResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid languageId.' })
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateLinkDto) {
    return this.linksService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: "List the user's links",
    description: 'If `languageId` is provided, only links for that language are returned.',
  })
  @ApiQuery({ name: 'languageId', required: false, description: 'Filter by language (ObjectId)' })
  @ApiOkResponse({ type: [LinkResponseDto] })
  findAll(@CurrentUser() user: AuthenticatedUser, @Query('languageId') languageId?: string) {
    if (languageId) {
      return this.linksService.findByLanguage(user.id, languageId);
    }
    return this.linksService.findAllByUser(user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update a link's url or description" })
  @ApiParam({ name: 'id', description: 'Link ID (ObjectId)' })
  @ApiOkResponse({ type: LinkResponseDto })
  @ApiNotFoundResponse({ description: 'Link not found.' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateLinkDto,
  ) {
    return this.linksService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a link' })
  @ApiParam({ name: 'id', description: 'Link ID (ObjectId)' })
  @ApiOkResponse({ schema: { example: { message: 'Link removed' } } })
  @ApiNotFoundResponse({ description: 'Link not found.' })
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.linksService.remove(id, user.id);
  }
}
