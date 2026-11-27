import { provablyFair, Seed } from './provably-fair';

export const getRouletteResult = (seed: Seed) => {
  const float = provablyFair(seed).generateFloat();
  const result = Math.floor(float * 37);
  return result;
};
