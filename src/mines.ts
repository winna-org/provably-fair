import { provablyFair, Seed } from './provably-fair';

export const getMinesResult = (
  seed: Seed,
  args: {
    mines: number;
    gridSize: number;
  },
) => {
  const result = provablyFair(seed).shuffle({
    size: args.gridSize,
    count: args.mines,
  });

  return result;
};
