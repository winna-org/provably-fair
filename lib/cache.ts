import { Json } from './types';

export const memoize = <Args extends [Json, ...Json[]], Result>(
  handler: (...args: Args) => Result,
  duration = 0, // in milliseconds, 0 = Infinity
) => {
  const cache = new Map<string, Result>();

  const func = (...args: Args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = handler(...args);
    if (result != null && !Number.isNaN(result)) {
      cache.set(key, result);
      if (duration > 0) {
        setTimeout(() => cache.delete(key), duration);
      }
    }
    return result;
  };
  return Object.assign(func, { clear: () => cache.clear() });
};

