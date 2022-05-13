import BigNumber from 'bignumber.js';

export const applyDecimalPrecision = (val: number, num: number): string => {
  const x = new BigNumber(val);
  const y = new BigNumber(10 ** num);
  const newAmount = x.dividedBy(y).toFormat();
  return newAmount;
};
