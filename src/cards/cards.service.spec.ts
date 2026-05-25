import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CardsService } from './cards.service';
import { Card } from './schemas/card.schema';
import { Deck } from '../decks/schemas/deck.schema';
import { Language } from '../languages/schemas/language.schema';
import { Progress } from '../progress/schemas/progress.schema';

const userId = new Types.ObjectId().toString();

function makeCardModel() {
  const exec = jest.fn().mockResolvedValue([]);
  const find = jest.fn().mockReturnValue({ exec });
  return { find, exec };
}

async function buildService(cardModel: any) {
  const passthrough = {};
  const module = await Test.createTestingModule({
    providers: [
      CardsService,
      { provide: getModelToken(Card.name), useValue: cardModel },
      { provide: getModelToken(Deck.name), useValue: passthrough },
      { provide: getModelToken(Language.name), useValue: passthrough },
      { provide: getModelToken(Progress.name), useValue: passthrough },
    ],
  }).compile();
  return module.get<CardsService>(CardsService);
}

describe('CardsService.findAllByUser', () => {
  it('filters only by userId when no query is given', async () => {
    const cardModel = makeCardModel();
    const service = await buildService(cardModel);

    await service.findAllByUser(userId);

    const filter = cardModel.find.mock.calls[0][0];
    expect(filter.userId).toBeInstanceOf(Types.ObjectId);
    expect(filter.$or).toBeUndefined();
  });

  it('adds a case-insensitive $or regex over front and back when q is given', async () => {
    const cardModel = makeCardModel();
    const service = await buildService(cardModel);

    await service.findAllByUser(userId, 'hola');

    const filter = cardModel.find.mock.calls[0][0];
    expect(filter.$or).toHaveLength(2);
    const [frontCond, backCond] = filter.$or;
    expect(frontCond.front).toBeInstanceOf(RegExp);
    expect(backCond.back).toBeInstanceOf(RegExp);
    expect(frontCond.front.flags).toContain('i');
    expect(frontCond.front.test('Dile HOLA a todos')).toBe(true);
  });

  it('escapes regex metacharacters so the query is matched literally', async () => {
    const cardModel = makeCardModel();
    const service = await buildService(cardModel);

    await service.findAllByUser(userId, '.*');

    const { $or } = cardModel.find.mock.calls[0][0];
    const frontRegex: RegExp = $or[0].front;
    // Treated as the literal string ".*", not a match-all pattern.
    expect(frontRegex.test('literal .* here')).toBe(true);
    expect(frontRegex.test('anything else')).toBe(false);
  });

  it('ignores a blank/whitespace-only query', async () => {
    const cardModel = makeCardModel();
    const service = await buildService(cardModel);

    await service.findAllByUser(userId, '   ');

    expect(cardModel.find.mock.calls[0][0].$or).toBeUndefined();
  });
});
