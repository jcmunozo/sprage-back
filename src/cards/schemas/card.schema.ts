import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CardDocument = Card & Document;

@Schema({ timestamps: true, strict: false })
export class Card {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Deck' })
  deckId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  front: string;

  @Prop({ required: true })
  back: string;

  @Prop()
  type: string;

  @Prop()
  language: string;

  @Prop([String])
  tags: string[];

  @Prop()
  example: string;

  @Prop()
  category: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);
