import { provablyFair, Seed } from './provably-fair';

const CARD_INDEXES = [
  '♠A', '♠2', '♠3', '♠4', '♠5', '♠6', '♠7', '♠8', '♠9', '♠10', '♠J', '♠Q', '♠K',
  '♥A', '♥2', '♥3', '♥4', '♥5', '♥6', '♥7', '♥8', '♥9', '♥10', '♥J', '♥Q', '♥K',
  '♦A', '♦2', '♦3', '♦4', '♦5', '♦6', '♦7', '♦8', '♦9', '♦10', '♦J', '♦Q', '♦K',
  '♣A', '♣2', '♣3', '♣4', '♣5', '♣6', '♣7', '♣8', '♣9', '♣10', '♣J', '♣Q', '♣K',
];

export const getTwentyOneResult = (seed: Seed, args: { numCards: number }) => {
  const result = provablyFair(seed).pickIndexes({
    size: 52,
    count: args.numCards,
  });
  return result.map(i => CARD_INDEXES[i]);
};
