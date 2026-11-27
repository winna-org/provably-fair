import { provablyFair, Seed } from './provably-fair';

const RTP = 0.99;

export const getLimboResult = (seed: Seed) => {
  const float = provablyFair(seed).generateFloat();
  const floatPoint = (1e8 / (float * 1e8)) * RTP;
  const crashPoint = Math.floor(floatPoint * 100) / 100;
  const result = Math.max(crashPoint, 1);
  return result;
};
