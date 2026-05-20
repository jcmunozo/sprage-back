import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Deck, DeckDocument } from './schemas/deck.schema';
import { Card, CardDocument } from '../cards/schemas/card.schema';
import {
  Progress,
  ProgressDocument,
} from '../progress/schemas/progress.schema';
import { CreateDeckDto, UpdateDeckDto } from './dto/deck.dto';

@Injectable()
export class DecksService {
  constructor(
    @InjectModel(Deck.name) private deckModel: Model<DeckDocument>,
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,
  ) {}

  async create(userId: string, dto: CreateDeckDto): Promise<DeckDocument> {
    const created = new this.deckModel({
      ...dto,
      userId: new Types.ObjectId(userId),
    });
    return created.save();
  }

  async findAllByUser(userId: string): Promise<Deck[]> {
    return this.deckModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  async findOne(id: string, userId: string): Promise<Deck> {
    const deck = await this.deckModel
      .findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();
    if (!deck) {
      throw new NotFoundException(`Deck with ID ${id} not found`);
    }
    return deck;
  }

  async update(id: string, userId: string, dto: UpdateDeckDto): Promise<Deck> {
    const updated = await this.deckModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
        dto,
        { new: true, runValidators: true },
      )
      .exec();
    if (!updated) {
      throw new NotFoundException(`Deck with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const deckObjectId = new Types.ObjectId(id);
    const userObjectId = new Types.ObjectId(userId);

    const result = await this.deckModel
      .deleteOne({ _id: deckObjectId, userId: userObjectId })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Deck with ID ${id} not found`);
    }

    const cards = await this.cardModel
      .find({ userId: userObjectId, deckId: deckObjectId })
      .select('_id')
      .lean()
      .exec();
    const cardIds = cards.map((c) => c._id);
    if (cardIds.length > 0) {
      await this.cardModel.deleteMany({ _id: { $in: cardIds } }).exec();
      await this.progressModel
        .deleteMany({ userId: userObjectId, cardId: { $in: cardIds } })
        .exec();
    }
    return { message: 'Deck removed' };
  }
}
