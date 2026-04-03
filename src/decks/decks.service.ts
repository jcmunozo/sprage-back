import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Deck, DeckDocument } from './schemas/deck.schema';

@Injectable()
export class DecksService {
  constructor(@InjectModel(Deck.name) private deckModel: Model<DeckDocument>) {}

  async create(userId: string, name: string, description?: string): Promise<DeckDocument> {
    const createdDeck = new this.deckModel({
      name,
      description,
      userId: new Types.ObjectId(userId),
    });
    return createdDeck.save();
  }

  async findAllByUser(userId: string): Promise<Deck[]> {
    return this.deckModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  async findOne(id: string, userId: string): Promise<Deck> {
    const deck = await this.deckModel.findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }).exec();
    if (!deck) {
      throw new NotFoundException(`Deck with ID ${id} not found`);
    }
    return deck;
  }

  async update(id: string, userId: string, updateDeckDto: any): Promise<Deck> {
    const existingDeck = await this.deckModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
        updateDeckDto,
        { new: true },
      )
      .exec();
    if (!existingDeck) {
      throw new NotFoundException(`Deck with ID ${id} not found`);
    }
    return existingDeck;
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const result = await this.deckModel.deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Deck with ID ${id} not found`);
    }
    return { message: 'Deck removed' };
  }
}
