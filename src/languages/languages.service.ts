import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Language, LanguageDocument } from './schemas/language.schema';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectModel(Language.name) private languageModel: Model<LanguageDocument>,
  ) {}

  async create(userId: string, name: string, code?: string): Promise<LanguageDocument> {
    const created = new this.languageModel({
      userId: new Types.ObjectId(userId),
      name,
      code,
    });
    return created.save();
  }

  async findAllByUser(userId: string): Promise<Language[]> {
    return this.languageModel
      .find({ userId: new Types.ObjectId(userId) })
      .exec();
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

  async update(id: string, userId: string, updateDto: any): Promise<Language> {
    const updated = await this.languageModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
        updateDto,
        { new: true },
      )
      .exec();
    if (!updated) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const result = await this.languageModel
      .deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }
    return { message: 'Language removed' };
  }
}
