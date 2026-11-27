import { provablyFair, Seed } from './provably-fair';

export const getCoinflipResult = (seed: Seed, index: number = 0) => {
  const float = provablyFair(seed, index).generateFloat();
  const result = float < 0.5 ? 'heads' : 'tails';
  return result;
};
