import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CardDocument = Card & Document;

@Schema({ timestamps: true })
export class Card {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Deck', default: null })
  deckId: MongooseSchema.Types.ObjectId | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Language', default: null })
  languageId: MongooseSchema.Types.ObjectId | null;

  @Prop({ required: true })
  front: string;

  @Prop({ required: true })
  back: string;

  @Prop()
  type: string;

  @Prop()
  category: string;

  @Prop([String])
  tags: string[];

  @Prop()
  example: string;

  @Prop()
  difficulty: string;

  @Prop({ index: true })
  externalId: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);
