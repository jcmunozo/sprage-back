import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VocabularyDocument = Vocabulary & Document;

@Schema({ timestamps: true })
export class Vocabulary {
  @Prop({ required: true, default: 'vocabulary' })
  type: string;

  @Prop({ required: true })
  language: string;

  @Prop()
  category: string;

  @Prop({ required: true })
  front: string;

  @Prop()
  back: string;

  @Prop()
  example: string;

  @Prop([String])
  tags: string[];

  @Prop({ enum: ['Beginner', 'Intermediate', 'Advanced'] })
  difficulty: string;

  @Prop({ required: true, unique: true })
  id: number;
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);
