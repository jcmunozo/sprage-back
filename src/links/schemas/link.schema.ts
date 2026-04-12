import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type LinkDocument = Link & Document;

@Schema({ timestamps: true })
export class Link {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  url: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  language: string;
}

export const LinkSchema = SchemaFactory.createForClass(Link);
