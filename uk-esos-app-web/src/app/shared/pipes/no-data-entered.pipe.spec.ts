import { NoDataEnteredPipe } from '@shared/pipes/no-data-entered.pipe';

describe('NoDataEnteredPipe', () => {
  const pipe = new NoDataEnteredPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform value', () => {
    expect(pipe.transform(5, 'kWh')).toEqual('5 kWh');
  });

  it('should transform value', () => {
    expect(pipe.transform(null)).toEqual('No data entered');
  });

  it('should transform value', () => {
    expect(pipe.transform(5)).toEqual('5');
  });

  it('should transform value', () => {
    expect(pipe.transform('abc')).toEqual('No data entered');
  });
});
