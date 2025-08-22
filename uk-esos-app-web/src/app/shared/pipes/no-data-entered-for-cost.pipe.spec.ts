import { NoDataEnteredForCostPipe } from '@shared/pipes/no-data-entered-for-cost.pipe';

describe('NoDataEnteredForCostPipe', () => {
  let pipe: NoDataEnteredForCostPipe;

  beforeEach(() => {
    pipe = new NoDataEnteredForCostPipe();
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the input value with a suffix if provided', () => {
    const result = pipe.transform('100', 'kWh');
    expect(result).toEqual('100 kWh');
  });

  it('should return the input ' + ' without a suffix if not provided', () => {
    const result = pipe.transform('£100');
    expect(result).toEqual('£100');
  });

  it('should return "No data entered" for empty string', () => {
    const result = pipe.transform('');
    expect(result).toEqual('No data entered');
  });

  it('should return "No data entered" for null input', () => {
    const result = pipe.transform(null);
    expect(result).toEqual('No data entered');
  });

  it('should return "No data entered" for undefined input', () => {
    const result = pipe.transform(undefined);
    expect(result).toEqual('No data entered');
  });
});
