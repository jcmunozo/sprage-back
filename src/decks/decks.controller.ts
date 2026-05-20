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
import { DecksService } from './decks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  AuthenticatedUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
import { CreateDeckDto, DeckResponseDto, UpdateDeckDto } from './dto/deck.dto';

@ApiTags('Decks')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
@Controller('decks')
@UseGuards(JwtAuthGuard)
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a deck for the authenticated user' })
  @ApiCreatedResponse({ type: DeckResponseDto })
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateDeckDto) {
    return this.decksService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: "List all of the user's decks" })
  @ApiOkResponse({ type: [DeckResponseDto] })
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.decksService.findAllByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a deck by ID' })
  @ApiParam({ name: 'id', description: 'Deck ID (ObjectId)' })
  @ApiOkResponse({ type: DeckResponseDto })
  @ApiNotFoundResponse({ description: 'Deck not found or does not belong to the user.' })
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.decksService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a deck' })
  @ApiParam({ name: 'id', description: 'Deck ID (ObjectId)' })
  @ApiOkResponse({ type: DeckResponseDto })
  @ApiNotFoundResponse({ description: 'Deck not found.' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateDeckDto,
  ) {
    return this.decksService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a deck (cascades to its cards and their progress)' })
  @ApiParam({ name: 'id', description: 'Deck ID (ObjectId)' })
  @ApiOkResponse({ schema: { example: { message: 'Deck removed' } } })
  @ApiNotFoundResponse({ description: 'Deck not found.' })
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.decksService.remove(id, user.id);
  }
}
