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
@ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a card',
    description:
      'The schema accepts extra fields (strict: false); any additional property is persisted.',
  })
  @ApiCreatedResponse({ type: CardResponseDto })
  create(@Request() req: any, @Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(req.user.id, createCardDto);
  }

  @Post('import')
  @ApiOperation({
    summary: 'Bulk import cards',
    description:
      'Inserts multiple cards in a single call. Cards with a (front, back) pair already existing for the user are skipped.',
  })
  @ApiCreatedResponse({ type: ImportCardsResponseDto })
  import(@Request() req: any, @Body() body: ImportCardsDto) {
    return this.cardsService.importCards(req.user.id, body.cards ?? []);
  }

  @Get()
  @ApiOperation({ summary: "List the user's cards" })
  @ApiOkResponse({ type: [CardResponseDto] })
  findAll(@Request() req: any) {
    return this.cardsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a card by ID' })
  @ApiParam({ name: 'id', description: 'Card ID (ObjectId)' })
  @ApiOkResponse({ type: CardResponseDto })
  @ApiNotFoundResponse({ description: 'Card not found.' })
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.cardsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a card' })
  @ApiParam({ name: 'id', description: 'Card ID (ObjectId)' })
  @ApiOkResponse({ type: CardResponseDto })
  @ApiNotFoundResponse({ description: 'Card not found.' })
  update(@Request() req: any, @Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(id, req.user.id, updateCardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a card' })
  @ApiParam({ name: 'id', description: 'Card ID (ObjectId)' })
  @ApiOkResponse({ schema: { example: { message: 'Card removed' } } })
  @ApiNotFoundResponse({ description: 'Card not found.' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.cardsService.remove(id, req.user.id);
  }
}
