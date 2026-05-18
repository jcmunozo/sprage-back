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
@ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
@Controller('decks')
@UseGuards(JwtAuthGuard)
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a deck for the authenticated user' })
  @ApiCreatedResponse({ type: DeckResponseDto })
  create(@Request() req: any, @Body() body: CreateDeckDto) {
    const { name, description } = body;
    return this.decksService.create(req.user.id, name, description);
  }

  @Get()
  @ApiOperation({ summary: "List all of the user's decks" })
  @ApiOkResponse({ type: [DeckResponseDto] })
  findAll(@Request() req: any) {
    return this.decksService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a deck by ID' })
  @ApiParam({ name: 'id', description: 'Deck ID (ObjectId)' })
  @ApiOkResponse({ type: DeckResponseDto })
  @ApiNotFoundResponse({ description: 'Deck not found or does not belong to the user.' })
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.decksService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a deck' })
  @ApiParam({ name: 'id', description: 'Deck ID (ObjectId)' })
  @ApiOkResponse({ type: DeckResponseDto })
  @ApiNotFoundResponse({ description: 'Deck not found.' })
  update(@Request() req: any, @Param('id') id: string, @Body() updateDeckDto: UpdateDeckDto) {
    return this.decksService.update(id, req.user.id, updateDeckDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a deck' })
  @ApiParam({ name: 'id', description: 'Deck ID (ObjectId)' })
  @ApiOkResponse({ schema: { example: { message: 'Deck removed' } } })
  @ApiNotFoundResponse({ description: 'Deck not found.' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.decksService.remove(id, req.user.id);
  }
}
