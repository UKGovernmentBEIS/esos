import { NotApplicablePipe } from './not-applicable.pipe';

describe('NotApplicablePipe', () => {
  const pipe = new NotApplicablePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform question with not applicable pipe', () => {
    expect(pipe.transform('YES')).toEqual('Yes');
    expect(pipe.transform('NO')).toEqual('No');
    expect(pipe.transform('NOT_APPLICABLE')).toEqual('Not applicable');
  });
});
