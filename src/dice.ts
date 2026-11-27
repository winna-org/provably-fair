import { provablyFair, Seed } from './provably-fair';

export const getDiceResult = (seed: Seed) => {
  const float = provablyFair(seed).generateFloat();
  const result = Math.floor(float * 10001) / 100;
  return result;
};
