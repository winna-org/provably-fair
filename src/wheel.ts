import { provablyFair, Seed } from './provably-fair';

export const getWheelResult = (seed: Seed, args: { segments: number }) => {
  const float = provablyFair(seed).generateFloat();
  const result = Math.floor(float * args.segments);
  return result;
};
