import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Card, CardDocument } from './schemas/card.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CardsService {
  constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>) {}

  async create(userId: string, createCardDto: any): Promise<CardDocument> {
    const createdCard = new this.cardModel({
      ...createCardDto,
      userId: new Types.ObjectId(userId),
    });
    return createdCard.save();
  }

  async findAllByUser(userId: string): Promise<Card[]> {
    return this.cardModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  async findOne(id: string, userId: string): Promise<Card> {
    const card = await this.cardModel.findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }).exec();
    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    return card;
  }

  async update(id: string, userId: string, updateCardDto: any): Promise<Card> {
    const existingCard = await this.cardModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
        updateCardDto,
        { new: true },
      )
      .exec();
    if (!existingCard) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    return existingCard;
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const result = await this.cardModel.deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    return { message: 'Card removed' };
  }

  async importUnifiedData(userId: string): Promise<{ message: string; importedCount: number }> {
    try {
      const filePath = path.join(process.cwd(), 'unified_data.json');
      if (!fs.existsSync(filePath)) {
        return { message: 'unified_data.json not found', importedCount: 0 };
      }
      const data = fs.readFileSync(filePath, 'utf8');
      const cardsData = JSON.parse(data);

      let importedCount = 0;

      for (const item of cardsData) {
        // We can check if a card with the same front/back already exists for this user
        const existingCard = await this.cardModel.findOne({
          userId: new Types.ObjectId(userId),
          front: item.front,
          back: item.back
        });

        if (!existingCard) {
          const { id, ...cardData } = item; // Remove old numeric ID
          const newCard = new this.cardModel({
            ...cardData,
            userId: new Types.ObjectId(userId),
            externalId: id, // Keep it as externalId if needed
          });
          await newCard.save();
          importedCount++;
        }
      }

      return {
        message: 'Cards import complete',
        importedCount,
      };
    } catch (error) {
      throw new Error(`Error importing cards: ${error.message}`);
    }
  }
}
