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
  ApiBadRequestResponse,
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
  AuthenticatedUser,
  CurrentUser,
} from '../common/decorators/current-user.decorator';
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
  @ApiOperation({ summary: 'Create a card' })
  @ApiCreatedResponse({ type: CardResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid deckId or languageId.' })
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateCardDto) {
    return this.cardsService.create(user.id, dto);
  }

  @Post('import')
  @ApiOperation({
    summary: 'Bulk import cards',
    description:
      'Inserts multiple cards in a single call. Cards with a (front, back) pair already existing for the user are skipped.',
  })
  @ApiCreatedResponse({ type: ImportCardsResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid deckId or languageId in payload.' })
  import(@CurrentUser() user: AuthenticatedUser, @Body() body: ImportCardsDto) {
    return this.cardsService.importCards(user.id, body.cards ?? []);
  }

  @Get()
  @ApiOperation({ summary: "List the user's cards" })
  @ApiOkResponse({ type: [CardResponseDto] })
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.cardsService.findAllByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a card by ID' })
  @ApiParam({ name: 'id', description: 'Card ID (ObjectId)' })
  @ApiOkResponse({ type: CardResponseDto })
  @ApiNotFoundResponse({ description: 'Card not found.' })
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.cardsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a card' })
  @ApiParam({ name: 'id', description: 'Card ID (ObjectId)' })
  @ApiOkResponse({ type: CardResponseDto })
  @ApiNotFoundResponse({ description: 'Card not found.' })
  @ApiBadRequestResponse({ description: 'Invalid deckId or languageId.' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateCardDto,
  ) {
    return this.cardsService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a card (cascades to its progress)' })
  @ApiParam({ name: 'id', description: 'Card ID (ObjectId)' })
  @ApiOkResponse({ schema: { example: { message: 'Card removed' } } })
  @ApiNotFoundResponse({ description: 'Card not found.' })
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.cardsService.remove(id, user.id);
  }
}
