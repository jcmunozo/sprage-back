import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ProgressService } from './progress.service';
import { Progress } from './schemas/progress.schema';
import { Card } from '../cards/schemas/card.schema';

const userId = new Types.ObjectId().toString();
const cardId = new Types.ObjectId().toString();

function makeProgress(overrides: Record<string, any> = {}) {
  const obj: any = {
    repetition: 0,
    easeFactor: 2.5,
    interval: 0,
    nextReviewDate: new Date(),
    status: 'new',
    ...overrides,
  };
  obj.save = jest.fn().mockResolvedValue(obj);
  return obj;
}

function makeProgressModel(progress: any) {
  const model: any = {
    findOne: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(progress) }),
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
    }),
    distinct: jest.fn().mockResolvedValue([]),
  };
  function ProgressModelCtor(data: any) {
    return { ...data, save: jest.fn().mockResolvedValue({ ...data }) };
  }
  Object.assign(ProgressModelCtor, model);
  return ProgressModelCtor;
}

function makeCardModel(cardOwnedByUser: boolean) {
  return {
    exists: jest.fn().mockResolvedValue(cardOwnedByUser ? { _id: cardId } : null),
    find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
  };
}

async function buildService(progress: any, cardOwnedByUser = true) {
  const module = await Test.createTestingModule({
    providers: [
      ProgressService,
      { provide: getModelToken(Progress.name), useValue: makeProgressModel(progress) },
      { provide: getModelToken(Card.name), useValue: makeCardModel(cardOwnedByUser) },
    ],
  }).compile();
  return module.get<ProgressService>(ProgressService);
}

describe('ProgressService - SM-2 algorithm', () => {
  describe('recordReview', () => {
    it('rejects review when card is not owned by the user', async () => {
      const progress = makeProgress();
      const service = await buildService(progress, false);

      await expect(service.recordReview(userId, cardId, 4)).rejects.toThrow();
    });

    it('first successful review (quality=3): interval=1, repetition=1, status=learning', async () => {
      const progress = makeProgress();
      const service = await buildService(progress);

      const result = await service.recordReview(userId, cardId, 3);

      expect(result.interval).toBe(1);
      expect(result.repetition).toBe(1);
      expect(result.status).toBe('learning');
    });

    it('second successful review (quality=4): interval=6, repetition=2', async () => {
      const progress = makeProgress({ repetition: 1, interval: 1 });
      const service = await buildService(progress);

      const result = await service.recordReview(userId, cardId, 4);

      expect(result.interval).toBe(6);
      expect(result.repetition).toBe(2);
    });

    it('third review uses easeFactor to calculate interval', async () => {
      const progress = makeProgress({ repetition: 2, interval: 6, easeFactor: 2.5 });
      const service = await buildService(progress);

      const result = await service.recordReview(userId, cardId, 5);

      expect(result.interval).toBe(Math.round(6 * 2.5));
      expect(result.repetition).toBe(3);
    });

    it('failed review (quality<3): resets repetition and interval, status=lapsed', async () => {
      const progress = makeProgress({ repetition: 3, interval: 10, status: 'learning' });
      const service = await buildService(progress);

      const result = await service.recordReview(userId, cardId, 1);

      expect(result.repetition).toBe(0);
      expect(result.interval).toBe(1);
      expect(result.status).toBe('lapsed');
    });

    it('marks card as graduated after repetition > 3', async () => {
      const progress = makeProgress({ repetition: 3, easeFactor: 2.5, interval: 6 });
      const service = await buildService(progress);

      const result = await service.recordReview(userId, cardId, 4);

      expect(result.repetition).toBe(4);
      expect(result.status).toBe('graduated');
    });

    it('easeFactor never drops below 1.3', async () => {
      const progress = makeProgress({ easeFactor: 1.31 });
      const service = await buildService(progress);

      const result = await service.recordReview(userId, cardId, 0);

      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    it('perfect review (quality=5) increases easeFactor', async () => {
      const progress = makeProgress({ easeFactor: 2.5 });
      const service = await buildService(progress);

      const result = await service.recordReview(userId, cardId, 5);

      expect(result.easeFactor).toBeGreaterThan(2.5);
    });

    it('poor review (quality=2) decreases easeFactor', async () => {
      const progress = makeProgress({ easeFactor: 2.5 });
      const service = await buildService(progress);

      const result = await service.recordReview(userId, cardId, 2);

      expect(result.easeFactor).toBeLessThan(2.5);
    });

    it('nextReviewDate is set in the future', async () => {
      const progress = makeProgress();
      const service = await buildService(progress);
      const before = new Date();

      const result = await service.recordReview(userId, cardId, 4);

      expect(result.nextReviewDate.getTime()).toBeGreaterThan(before.getTime());
    });
  });
});
