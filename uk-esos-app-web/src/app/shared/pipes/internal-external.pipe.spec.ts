import { InternalExternalPipe } from './internal-external.pipe';

describe('InternalExternalPipe', () => {
  const pipe = new InternalExternalPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform question with internal external pipe', () => {
    expect(pipe.transform('INTERNAL')).toEqual('Internal');
    expect(pipe.transform('EXTERNAL')).toEqual('External');
  });
});
