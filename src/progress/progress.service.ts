import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Progress, ProgressDocument } from './schemas/progress.schema';
import { Card, CardDocument } from '../cards/schemas/card.schema';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
  ) {}

  private async assertCardOwnership(userId: Types.ObjectId, cardId: Types.ObjectId): Promise<void> {
    const exists = await this.cardModel.exists({ _id: cardId, userId });
    if (!exists) {
      throw new NotFoundException(`Card with ID ${cardId.toString()} not found`);
    }
  }

  async getOrCreateProgress(userId: string, cardId: string): Promise<ProgressDocument> {
    const userObjectId = new Types.ObjectId(userId);
    const cardObjectId = new Types.ObjectId(cardId);

    await this.assertCardOwnership(userObjectId, cardObjectId);

    let progress = await this.progressModel
      .findOne({ userId: userObjectId, cardId: cardObjectId })
      .exec();

    if (!progress) {
      progress = new this.progressModel({
        userId: userObjectId,
        cardId: cardObjectId,
      });
      await progress.save();
    }

    return progress;
  }

  async recordReview(userId: string, cardId: string, quality: number): Promise<ProgressDocument> {
    const progress = await this.getOrCreateProgress(userId, cardId);

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

    if (quality < 3) {
      progress.status = 'lapsed';
    } else if (repetition > 3) {
      progress.status = 'graduated';
    } else {
      progress.status = 'learning';
    }

    return progress.save();
  }

  async getDueCards(userId: string): Promise<{ due: ProgressDocument[]; new: CardDocument[] }> {
    const userObjectId = new Types.ObjectId(userId);

    const dueProgress = await this.progressModel
      .find({ userId: userObjectId, nextReviewDate: { $lte: new Date() } })
      .populate({ path: 'cardId', match: { userId: userObjectId } })
      .exec();

    const due = dueProgress.filter((p) => p.cardId);

    const startedCardIds = await this.progressModel.distinct('cardId', {
      userId: userObjectId,
    });

    const newCards = await this.cardModel
      .find({ userId: userObjectId, _id: { $nin: startedCardIds } })
      .exec();

    return { due, new: newCards };
  }
}
