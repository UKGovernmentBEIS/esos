import { SkipQuestionPipe } from './skip-question.pipe';

describe('SkipQuestionPipe', () => {
  const pipe = new SkipQuestionPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform question with skip answer pipe', () => {
    expect(pipe.transform('YES')).toEqual('Yes');
    expect(pipe.transform('NO')).toEqual('No');
    expect(pipe.transform('SKIP_QUESTION')).toEqual('Skip question');
  });
});
