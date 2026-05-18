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
@ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
@Controller('links')
@UseGuards(JwtAuthGuard)
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a link associated with a language' })
  @ApiCreatedResponse({ type: LinkResponseDto })
  create(@Request() req: any, @Body() createLinkDto: CreateLinkDto) {
    return this.linksService.create(req.user.id, createLinkDto);
  }

  @Get()
  @ApiOperation({
    summary: "List the user's links",
    description: 'If `languageId` is provided, only links for that language are returned.',
  })
  @ApiQuery({ name: 'languageId', required: false, description: 'Filter by language (ObjectId)' })
  @ApiOkResponse({ type: [LinkResponseDto] })
  findAll(@Request() req: any, @Query('languageId') languageId?: string) {
    if (languageId) {
      return this.linksService.findByLanguage(req.user.id, languageId);
    }
    return this.linksService.findAllByUser(req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Update a link's url or description" })
  @ApiParam({ name: 'id', description: 'Link ID (ObjectId)' })
  @ApiOkResponse({ type: LinkResponseDto })
  @ApiNotFoundResponse({ description: 'Link not found.' })
  update(@Request() req: any, @Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.update(id, req.user.id, updateLinkDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a link' })
  @ApiParam({ name: 'id', description: 'Link ID (ObjectId)' })
  @ApiOkResponse({ schema: { example: { message: 'Link removed' } } })
  @ApiNotFoundResponse({ description: 'Link not found.' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.linksService.remove(id, req.user.id);
  }
}
