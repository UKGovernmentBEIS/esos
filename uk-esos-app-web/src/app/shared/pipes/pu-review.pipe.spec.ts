import { ProgressUpdateReviewPipe } from './pu-review.pipe';

describe('ProgressUpdateReviewPipe', () => {
  const pipe = new ProgressUpdateReviewPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform', () => {
    let transformation: string;

    transformation = pipe.transform('ESOS_ACTION_PLAN_COMPLIANCE');
    expect(transformation).toEqual(
      'the progress update has been produced following notification of an ESOS action plan and includes the content required by regulation 34B of the ESOS regulations.',
    );
    transformation = pipe.transform('ESTIMATION_METHOD_DOCUMENTED');
    expect(transformation).toEqual(
      'where an estimate of the reduction in energy consumption is not based on an energy audit or estimate in the action plan, a description of the estimation method and reasons for using it are recorded in the evidence pack.',
    );
  });
});
