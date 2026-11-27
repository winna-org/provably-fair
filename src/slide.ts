import crypto from 'crypto';

export const getSlideResult = (seed: string, hash: string) => {
  const int = crypto
    .createHmac('sha256', hash)
    .update(seed)
    .digest()
    .readUInt32BE(0);

  const result = Math.max(1, (0x100000000 / (int + 1)) * 0.965);
  return result;
};
