import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vocabulary, VocabularyDocument } from './schemas/vocabulary.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VocabularyService {
  constructor(
    @InjectModel(Vocabulary.name)
    private vocabularyModel: Model<VocabularyDocument>,
  ) {}

  async findAll(): Promise<Vocabulary[]> {
    return this.vocabularyModel.find().exec();
  }

  async findOne(id: number): Promise<Vocabulary> {
    const vocabulary = await this.vocabularyModel.findOne({ id }).exec();
    if (!vocabulary) {
      throw new NotFoundException(`Vocabulary card with ID ${id} not found`);
    }
    return vocabulary;
  }

  async create(createVocabularyDto: any): Promise<Vocabulary> {
    const createdVocabulary = new this.vocabularyModel(createVocabularyDto);
    return createdVocabulary.save();
  }

  async update(id: number, updateVocabularyDto: any): Promise<Vocabulary> {
    const existingVocabulary = await this.vocabularyModel
      .findOneAndUpdate({ id }, updateVocabularyDto, { new: true })
      .exec();
    if (!existingVocabulary) {
      throw new NotFoundException(`Vocabulary card with ID ${id} not found`);
    }
    return existingVocabulary;
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.vocabularyModel.deleteOne({ id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Vocabulary card with ID ${id} not found`);
    }
    return { message: 'Vocabulary card removed' };
  }

  async import(): Promise<{ message: string; importedCount: number; updatedCount: number }> {
    try {
      const filePath = path.join(process.cwd(), 'unified_data.json');
      const data = fs.readFileSync(filePath, 'utf8');
      const vocabularyData = JSON.parse(data);

      let importedCount = 0;
      let updatedCount = 0;

      for (const item of vocabularyData) {
        const existingCard = await this.vocabularyModel.findOne({ id: item.id });

        if (existingCard) {
          Object.assign(existingCard, item);
          await existingCard.save();
          updatedCount++;
        } else {
          const newCard = new this.vocabularyModel(item);
          await newCard.save();
          importedCount++;
        }
      }

      return {
        message: 'Vocabulary import complete',
        importedCount,
        updatedCount,
      };
    } catch (error) {
      throw new Error(`Error importing vocabulary: ${error.message}`);
    }
  }
}
