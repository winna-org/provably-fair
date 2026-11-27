import { provablyFair, Seed } from './provably-fair';

// const CARD_INDEXES = [
//   '♠A', '♠2', '♠3', '♠4', '♠5', '♠6', '♠7', '♠8', '♠9', '♠10', '♠J', '♠Q', '♠K',
//   '♥A', '♥2', '♥3', '♥4', '♥5', '♥6', '♥7', '♥8', '♥9', '♥10', '♥J', '♥Q', '♥K',
//   '♣A', '♣2', '♣3', '♣4', '♣5', '♣6', '♣7', '♣8', '♣9', '♣10', '♣J', '♣Q', '♣K',
//   '♦A', '♦2', '♦3', '♦4', '♦5', '♦6', '♦7', '♦8', '♦9', '♦10', '♦J', '♦Q', '♦K',
// ];

export const getHiloResult = (seed: Seed, index: number) => {
  const float = provablyFair(seed, index).generateFloat();
  const result = Math.floor(float * 52);
  return result;
};
