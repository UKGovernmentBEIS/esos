import { CapitalizeFirstPipe } from './capitalize-first.pipe';

describe('CapitalizeFirstPipe', () => {
  it('create an instance', () => {
    const pipe = new CapitalizeFirstPipe();
    expect(pipe).toBeTruthy();
  });

  it('should capitalize only the first letter', () => {
    const pipe = new CapitalizeFirstPipe();
    expect(pipe.transform('capitalize first')).toBe('Capitalize first');
    expect(pipe.transform('capitalize FIRST')).toBe('Capitalize FIRST');
    expect(pipe.transform('CAPITALIZE First')).toBe('CAPITALIZE First');

    expect(pipe.transform('capitalize first', true)).toBe('Capitalize first');
    expect(pipe.transform('capitalize FIRST', true)).toBe('Capitalize first');
    expect(pipe.transform('CAPITALIZE First', true)).toBe('Capitalize first');
  });
});
