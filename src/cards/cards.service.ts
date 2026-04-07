import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Card, CardDocument } from './schemas/card.schema';

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

  async importCards(userId: string, cardsData: any[]): Promise<{ message: string; importedCount: number }> {
    const userObjectId = new Types.ObjectId(userId);

    // Fetch all existing front+back pairs in one query to avoid N+1
    const existing = await this.cardModel
      .find({ userId: userObjectId })
      .select('front back')
      .lean()
      .exec();
    const existingSet = new Set(existing.map((c) => `${c.front}||${c.back}`));

    const toInsert = cardsData
      .filter((item) => !existingSet.has(`${item.front}||${item.back}`))
      .map(({ id, ...cardData }) => ({
        ...cardData,
        userId: userObjectId,
        ...(id !== undefined && { externalId: id }),
      }));

    if (toInsert.length > 0) {
      await this.cardModel.insertMany(toInsert, { ordered: false });
    }

    return { message: 'Cards import complete', importedCount: toInsert.length };
  }
}
