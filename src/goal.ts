import { provablyFair, Seed } from './provably-fair';

const POSITION_MULTIPLIERS = [10, 2, 3, 10, 5, 5, 8, 1.25, 1.5, 8];

type Mode = 'regular' | 'enhanced';
type Option = { value: number; weight: number };

const REGULAR_WIN_SCALE = 0.9079521286591625;
const ENHANCED_WIN_SCALE = 0.8601284403172021;
const ENHANCED_BET_MULTIPLIER = 2.5;
const GOLDEN_KICK_CHANCE = 0.05;

const REGULAR_BOOST_COUNT_WEIGHTS: Option[] = [
  { value: 3, weight: 1_000_000 },
  { value: 4, weight: 500_000 },
  { value: 5, weight: 150_000 },
  { value: 6, weight: 60_000 },
  { value: 7, weight: 15_000 },
  { value: 8, weight: 3_000 },
  { value: 9, weight: 500 },
  { value: 10, weight: 100 },
];
const REGULAR_BOOST_MULT_WEIGHTS: Option[] = [
  { value: 2, weight: 3_000_000 },
  { value: 5, weight: 1_500_000 },
  { value: 10, weight: 500_000 },
  { value: 25, weight: 150_000 },
  { value: 50, weight: 25_000 },
  { value: 100, weight: 6_000 },
  { value: 250, weight: 1_500 },
  { value: 500, weight: 500 },
  { value: 1_000, weight: 50 },
  { value: 6_000, weight: 3 },
];
const ENHANCED_BOOST_COUNT_WEIGHTS: Option[] = [
  { value: 3, weight: 500_000 },
  { value: 4, weight: 300_000 },
  { value: 5, weight: 150_000 },
  { value: 6, weight: 60_000 },
  { value: 7, weight: 15_000 },
  { value: 8, weight: 3_000 },
  { value: 9, weight: 500 },
  { value: 10, weight: 100 },
];
const ENHANCED_BOOST_MULT_WEIGHTS: Option[] = [
  { value: 2, weight: 1_670_000 },
  { value: 5, weight: 1_500_000 },
  { value: 10, weight: 500_000 },
  { value: 25, weight: 150_000 },
  { value: 50, weight: 25_000 },
  { value: 100, weight: 6_000 },
  { value: 250, weight: 1_500 },
  { value: 500, weight: 500 },
  { value: 1_000, weight: 50 },
  { value: 6_000, weight: 3 },
];

const pickWeighted = (options: Option[], roll: number) => {
  const totalWeight = options.reduce((sum, o) => sum + o.weight, 0);
  let cumulative = 0;
  for (const option of options) {
    cumulative += option.weight / totalWeight;
    if (roll < cumulative) return option.value;
  }
  return options[options.length - 1].value;
};

export const getGoalResult = (
  seed: Seed,
  args: {
    mode: Mode;
    events: number;
    position: number;
    currentMultiplier: number;
  },
) => {
  const { mode, events, position, currentMultiplier } = args;
  const { generateFloat, pickIndexes } = provablyFair(seed, events);

  const isFirstKick = currentMultiplier === 0;
  const isGoldenKick =
    (mode === 'enhanced' && isFirstKick) ||
    generateFloat() < GOLDEN_KICK_CHANCE;

  const boostTables =
    mode === 'enhanced' && isFirstKick
      ? {
          count: ENHANCED_BOOST_COUNT_WEIGHTS,
          mult: ENHANCED_BOOST_MULT_WEIGHTS,
        }
      : {
          count: REGULAR_BOOST_COUNT_WEIGHTS,
          mult: REGULAR_BOOST_MULT_WEIGHTS,
        };

  const boosts = isGoldenKick
    ? pickIndexes({
        size: POSITION_MULTIPLIERS.length,
        count: pickWeighted(boostTables.count, generateFloat()),
      }).map((pos) => ({
        position: pos,
        multiplier: pickWeighted(boostTables.mult, generateFloat()),
      }))
    : [];

  const baseMultiplier = POSITION_MULTIPLIERS[position];
  const boost = boosts.find((b) => b.position === position);
  const kickMultiplier = boost
    ? baseMultiplier * boost.multiplier
    : baseMultiplier;

  const winChance = isFirstKick
    ? (mode === 'enhanced' ? ENHANCED_WIN_SCALE : REGULAR_WIN_SCALE) /
      baseMultiplier
    : 1 / kickMultiplier;
  const win = generateFloat() < winChance;

  const nextAccumulated = isFirstKick
    ? kickMultiplier
    : currentMultiplier * kickMultiplier;

  const result = win
    ? mode === 'enhanced'
      ? nextAccumulated / ENHANCED_BET_MULTIPLIER
      : nextAccumulated
    : 0;

  return result;
};
