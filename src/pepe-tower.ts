import { provablyFair, Seed } from './provably-fair';

type Risk = 'easy' | 'medium' | 'hard' | 'expert' | 'master';

export const LEVEL_MAP: Record<Risk, { count: number; size: number }> = {
  easy: { count: 3, size: 4 },
  medium: { count: 2, size: 3 },
  hard: { count: 1, size: 2 },
  expert: { count: 1, size: 3 },
  master: { count: 1, size: 4 },
};

export const getPepeTowerResult = (seed: Seed, args: { risk: Risk }) => {
  const { shuffle } = provablyFair(seed);
  const { count, size } = LEVEL_MAP[args.risk];

  const result: (0 | 1)[][] = [];
  for (let i = 0; i < 9; ++i) {
    result[i] = shuffle({ count, size });
  }
  return result;
};
