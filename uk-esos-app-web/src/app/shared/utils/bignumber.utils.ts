import BigNumber from 'bignumber.js';

export function format(value: BigNumber, maxDecimals: number = 5): string {
  const decimals = value.decimalPlaces();
  const decimalsToTrim = decimals <= maxDecimals ? decimals : maxDecimals;

  return value.toFixed(decimalsToTrim);
}

export function getFixedCost(value: string | number, digits: number = 2): string {
  return new BigNumber(value).toFixed(digits);
}

export function isInputBigNumberEmpty(value: unknown): boolean {
  return value === null || value === '';
}

export function getFixedCostOptional(value: string | number, digits: number = 2): string | null {
  return isInputBigNumberEmpty(value) ? null : getFixedCost(value, digits);
}
