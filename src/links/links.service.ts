import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Link, LinkDocument } from './schemas/link.schema';

@Injectable()
export class LinksService {
  constructor(@InjectModel(Link.name) private linkModel: Model<LinkDocument>) {}

  async create(userId: string, createLinkDto: any): Promise<LinkDocument> {
    const { url, description, languageId } = createLinkDto;
    const createdLink = new this.linkModel({
      userId: new Types.ObjectId(userId),
      url,
      description,
      languageId: new Types.ObjectId(languageId),
    });
    const saved = await createdLink.save();
    return saved.populate('languageId');
  }

  async update(id: string, userId: string, updateDto: any): Promise<LinkDocument> {
    const { url, description } = updateDto;
    const updated = await this.linkModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
        { $set: { url, description } },
        { new: true },
      )
      .populate('languageId')
      .exec();
    if (!updated) throw new NotFoundException(`Link with ID ${id} not found`);
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
      .find({ userId: new Types.ObjectId(userId), languageId: new Types.ObjectId(languageId) })
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
