import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Language, LanguageDocument } from './schemas/language.schema';
import { Link, LinkDocument } from '../links/schemas/link.schema';
import { Card, CardDocument } from '../cards/schemas/card.schema';
import { CreateLanguageDto, UpdateLanguageDto } from './dto/language.dto';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectModel(Language.name) private languageModel: Model<LanguageDocument>,
    @InjectModel(Link.name) private linkModel: Model<LinkDocument>,
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
  ) {}

  async create(userId: string, dto: CreateLanguageDto): Promise<LanguageDocument> {
    const created = new this.languageModel({
      ...dto,
      userId: new Types.ObjectId(userId),
    });
    return created.save();
  }

  async findAllByUser(userId: string): Promise<Language[]> {
    return this.languageModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  async findOne(id: string, userId: string): Promise<Language> {
    const language = await this.languageModel
      .findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();
    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }
    return language;
  }

  async update(id: string, userId: string, dto: UpdateLanguageDto): Promise<Language> {
    const updated = await this.languageModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
        dto,
        { new: true, runValidators: true },
      )
      .exec();
    if (!updated) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const languageObjectId = new Types.ObjectId(id);
    const userObjectId = new Types.ObjectId(userId);

    const result = await this.languageModel
      .deleteOne({ _id: languageObjectId, userId: userObjectId })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }

    await this.linkModel
      .deleteMany({ userId: userObjectId, languageId: languageObjectId })
      .exec();
    await this.cardModel
      .updateMany(
        { userId: userObjectId, languageId: languageObjectId },
        { $set: { languageId: null } },
      )
      .exec();
    return { message: 'Language removed' };
  }
}
