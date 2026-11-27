import crypto from 'crypto';
import assert from 'assert';

import { schema } from '~/lib/schema';
import { memoize } from '~/lib/cache';

export const seedSchema = schema.object({
  nonce: schema.number(),
  clientSeed: schema.string(),
  serverSeed: schema.string(),
});

export type Seed = schema.infer<typeof seedSchema>;

const factorial = memoize((n: number) => {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
});

export const combinations = memoize((n: number, k: number) => {
  if (k > n) return 0;
  return factorial(n) / (factorial(k) * factorial(n - k));
});

function* floatGenerator(
  seed: Seed,
  startCursor: number = 0,
  startOffset: number = 0,
): Generator<number, number> {
  const { clientSeed, serverSeed, nonce } = seed;

  let cursor = startCursor;
  let offset = startOffset;

  while (true) {
    const hmac = crypto.createHmac('sha256', serverSeed);
    hmac.update(`${clientSeed}:${nonce}:${cursor}`);
    const buffer = hmac.digest();

    for (let i = offset; i + 4 <= buffer.length; i += 4) {
      const int = buffer.readUInt32BE(i); // 32-bit unsigned integer
      yield int / 0x100000000;
    }
    cursor++;
    offset = 0; // Reset offset for subsequent buffers
  }
}

export const provablyFair = (seed: Seed, floatIndex?: number) => {
  // Each HMAC digest produces 8 floats (32 bytes / 4 bytes per float = 8)
  const startOffset = floatIndex ? (floatIndex % 8) * 4 : 0;
  const startCursor = floatIndex ? Math.floor(floatIndex / 8) : 0;

  const rng = floatGenerator(seed, startCursor, startOffset);

  function generateFloats(count: number) {
    return Array.from({ length: count }, () => rng.next().value);
  }

  function shuffleIndexes(size: number, count: number) {
    const available = Array.from({ length: size }, (_, i) => i);
    const indexes = generateFloats(count).map((float, idx) => {
      const index = Math.floor(float * (size - idx));
      return available.splice(index, 1)[0];
    });
    return indexes;
  }

  function pickIndexes(size: number, count: number) {
    const available = Array.from({ length: size }, (_, i) => i);
    const floats = generateFloats(count);
    const picks: number[] = [];
    for (let i = 0; i < count; i++) {
      const index = Math.floor(floats[i] * (size - i));
      picks.push(available.splice(index, 1)[0]);
    }
    return picks;
  }

  return {
    /*
     * Generate and return a single float from seed
     */
    generateFloat: () => generateFloats(1)[0],

    /*
     * Generate {count} number of floats from seed
     */
    generateFloats: (count: number) => generateFloats(count),

    /*
     * Generate an array of {count} indexes, represented as ints from seed
     * Shuffled using Fisher-Yates
     */
    pickIndexes: ({ size, count }: { size: number; count: number }) =>
      pickIndexes(size, count),

    /*
     * Generate an array of indexes represented as ints from seed
     * Shuffled using Fisher-Yates
     */
    shuffleIndexes: (size: number) => shuffleIndexes(size, size),

    /*
     * Generate a shuffled array with {size} number of 0's and 1's
     * Array will have {count} number of 1's at the assigned indexes
     */
    shuffle: ({ size, count }: { size: number; count: number }) => {
      assert(count < size, 'count_must_be_less_than_size');
      const indexes = shuffleIndexes(size, count);
      const shuffled: (0 | 1)[] = [];
      for (let i = 0; i < size; ++i) {
        shuffled.push(indexes.includes(i) ? 1 : 0);
      }
      return shuffled;
    },
  };
};

export type Numbers = ReturnType<typeof provablyFair>;
