import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Progress, ProgressDocument } from './schemas/progress.schema';

@Injectable()
export class ProgressService {
  constructor(@InjectModel(Progress.name) private progressModel: Model<ProgressDocument>) {}

  async getOrCreateProgress(userId: string, cardId: string): Promise<ProgressDocument> {
    let progress = await this.progressModel.findOne({
      userId: new Types.ObjectId(userId),
      cardId: new Types.ObjectId(cardId),
    }).exec();

    if (!progress) {
      progress = new this.progressModel({
        userId: new Types.ObjectId(userId),
        cardId: new Types.ObjectId(cardId),
      });
      await progress.save();
    }

    return progress;
  }

  async recordReview(userId: string, cardId: string, quality: number): Promise<ProgressDocument> {
    const progress = await this.getOrCreateProgress(userId, cardId);

    // SM-2 Algorithm
    let { repetition, easeFactor, interval } = progress;

    if (quality >= 3) {
      if (repetition === 0) {
        interval = 1;
      } else if (repetition === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetition += 1;
    } else {
      repetition = 0;
      interval = 1;
    }

    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    progress.repetition = repetition;
    progress.easeFactor = easeFactor;
    progress.interval = interval;
    
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);
    progress.nextReviewDate = nextReview;

    // Update status
    if (quality < 3) {
      progress.status = 'lapsed';
    } else if (repetition > 3) {
      progress.status = 'graduated';
    } else {
      progress.status = 'learning';
    }

    return progress.save();
  }

  async getDueCards(userId: string): Promise<any[]> {
    return this.progressModel.find({
      userId: new Types.ObjectId(userId),
      nextReviewDate: { $lte: new Date() },
    }).populate('cardId').exec();
  }
}
