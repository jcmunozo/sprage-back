import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Deck, DeckSchema } from './schemas/deck.schema';
import { Card, CardSchema } from '../cards/schemas/card.schema';
import { Progress, ProgressSchema } from '../progress/schemas/progress.schema';
import { DecksService } from './decks.service';
import { DecksController } from './decks.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Deck.name, schema: DeckSchema },
      { name: Card.name, schema: CardSchema },
      { name: Progress.name, schema: ProgressSchema },
    ]),
  ],
  controllers: [DecksController],
  providers: [DecksService],
  exports: [DecksService],
})
export class DecksModule {}
