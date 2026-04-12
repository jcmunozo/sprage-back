import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Link, LinkDocument } from './schemas/link.schema';

@Injectable()
export class LinksService {
  constructor(@InjectModel(Link.name) private linkModel: Model<LinkDocument>) {}

  async create(userId: string, createLinkDto: any): Promise<LinkDocument> {
    const createdLink = new this.linkModel({
      ...createLinkDto,
      userId: new Types.ObjectId(userId),
    });
    return createdLink.save();
  }

  async findAllByUser(userId: string): Promise<Link[]> {
    return this.linkModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  async findByLanguage(userId: string, language: string): Promise<Link[]> {
    return this.linkModel
      .find({ userId: new Types.ObjectId(userId), language })
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
