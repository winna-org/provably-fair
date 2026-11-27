import { provablyFair, Seed } from './provably-fair';

const PAYOUT_MAP = {
  low: [1.2, 1.5, 2, 3, 5, 10, 20, 75, 250],
  medium: [1.4, 2, 3, 5, 10, 25, 75, 250, 1000],
  high: [1.7, 3, 5, 10, 25, 75, 250, 1000, 5000],
};

type Risk = keyof typeof PAYOUT_MAP;

export const getCoinClimberResult = (
  seed: Seed,
  args: {
    risk: Risk;
    numCoins: number;
  },
) => {
  const { generateFloat } = provablyFair(seed);
  const payouts = PAYOUT_MAP[args.risk];

  const result = Array.from({ length: args.numCoins }, () => {
    for (let i = 0; i < payouts.length; i++) {
      const float = generateFloat();
      const prev = i === 0 ? 0.98 : payouts[i - 1];
      if (float > prev / payouts[i]) return i;
    }
    return payouts.length;
  });
  return result;
};
