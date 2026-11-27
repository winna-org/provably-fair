import { provablyFair, Seed } from './provably-fair';

const DRAW_COUNT = 10;
const FIELD_SIZE = 40;

export const getKenoResult = (seed: Seed) => {
  const result = provablyFair(seed).pickIndexes({
    size: FIELD_SIZE,
    count: DRAW_COUNT,
  });
  return result;
};
