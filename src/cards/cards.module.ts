import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from './schemas/card.schema';
import { Deck, DeckSchema } from '../decks/schemas/deck.schema';
import { Language, LanguageSchema } from '../languages/schemas/language.schema';
import { Progress, ProgressSchema } from '../progress/schemas/progress.schema';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Card.name, schema: CardSchema },
      { name: Deck.name, schema: DeckSchema },
      { name: Language.name, schema: LanguageSchema },
      { name: Progress.name, schema: ProgressSchema },
    ]),
  ],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
