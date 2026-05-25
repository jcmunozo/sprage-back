import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Link, LinkDocument } from './schemas/link.schema';
import { Language, LanguageDocument } from '../languages/schemas/language.schema';
import { CreateLinkDto, UpdateLinkDto } from './dto/link.dto';

@Injectable()
export class LinksService {
  constructor(
    @InjectModel(Link.name) private linkModel: Model<LinkDocument>,
    @InjectModel(Language.name) private languageModel: Model<LanguageDocument>,
  ) {}

  private async assertLanguageOwnership(
    userId: Types.ObjectId,
    languageId: string,
  ): Promise<Types.ObjectId> {
    const langObjectId = new Types.ObjectId(languageId);
    const exists = await this.languageModel.exists({ _id: langObjectId, userId });
    if (!exists) {
      throw new BadRequestException('Invalid languageId');
    }
    return langObjectId;
  }

  async create(userId: string, dto: CreateLinkDto): Promise<LinkDocument> {
    const userObjectId = new Types.ObjectId(userId);
    const langObjectId = await this.assertLanguageOwnership(userObjectId, dto.languageId);

    const created = new this.linkModel({
      userId: userObjectId,
      url: dto.url,
      description: dto.description,
      languageId: langObjectId,
    });
    const saved = await created.save();
    return saved.populate('languageId');
  }

  async update(id: string, userId: string, dto: UpdateLinkDto): Promise<LinkDocument> {
    const updated = await this.linkModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
        { $set: { url: dto.url, description: dto.description } },
        { new: true, runValidators: true },
      )
      .populate('languageId')
      .exec();
    if (!updated) {
      throw new NotFoundException(`Link with ID ${id} not found`);
    }
    return updated;
  }

  async findAllByUser(userId: string): Promise<Link[]> {
    return this.linkModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('languageId')
      .exec();
  }

  async findByLanguage(userId: string, languageId: string): Promise<Link[]> {
    return this.linkModel
      .find({
        userId: new Types.ObjectId(userId),
        languageId: new Types.ObjectId(languageId),
      })
      .populate('languageId')
      .exec();
  }

  async remove(id: string, userId: string): Promise<{ message: string }> {
    const result = await this.linkModel
      .deleteOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Link with ID ${id} not found`);
    }
    return { message: 'Link removed' };
  }
}
