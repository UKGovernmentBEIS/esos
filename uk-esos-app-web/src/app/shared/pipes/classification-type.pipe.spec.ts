import { ClassificationTypePipe } from './classification-type.pipe';

describe('ClassificationTypePipe', () => {
  const pipe = new ClassificationTypePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform classification type', () => {
    expect(pipe.transform('OTHER')).toEqual('Other');
    expect(pipe.transform('SIC')).toEqual('SIC');
    expect(pipe.transform(null)).toEqual(null);
  });
});
