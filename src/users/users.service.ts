import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

const BCRYPT_COST = 12;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(email: string, password: string, username: string): Promise<UserDocument> {
    const normalized = normalizeEmail(email);
    const existingUser = await this.userModel.findOne({ email: normalized }).exec();
    if (existingUser) {
      throw new ConflictException('Registration failed');
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_COST);
    const createdUser = new this.userModel({
      email: normalized,
      password: hashedPassword,
      username,
    });
    return createdUser.save();
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ email: normalizeEmail(email) })
      .select('+password')
      .exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }
}
