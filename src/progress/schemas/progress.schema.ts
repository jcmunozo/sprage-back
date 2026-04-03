import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProgressDocument = Progress & Document;

@Schema({ timestamps: true })
export class Progress {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Card', required: true })
  cardId: MongooseSchema.Types.ObjectId;

  @Prop({ default: 0 })
  repetition: number;

  @Prop({ default: 2.5 })
  easeFactor: number;

  @Prop({ default: 0 })
  interval: number; // in days

  @Prop({ default: Date.now })
  nextReviewDate: Date;

  @Prop({ enum: ['new', 'learning', 'graduated', 'lapsed'], default: 'new' })
  status: string;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
// Compound index to ensure unique progress per user/card
ProgressSchema.index({ userId: 1, cardId: 1 }, { unique: true });
