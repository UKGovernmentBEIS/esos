import { ActionPlanReviewPipe } from './action-plan-review.pipe';

describe('ActionPlanReviewPipe', () => {
  const pipe = new ActionPlanReviewPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform', () => {
    let transformation: string;

    transformation = pipe.transform('ESOS_ASSESSMENT_NOTIFICATION');
    expect(transformation).toEqual(
      'the action plan has been produced following a notification of compliance for an ESOS assessment and includes the content required by regulation 34A of the ESOS regulations',
    );
    transformation = pipe.transform('ESTIMATION_METHOD_DESCRIPTION');
    expect(transformation).toEqual(
      'where an estimate of the total energy saving reasonably expected to be achieved by implementing any measure is not based on an ESOS assessment (energy audit or alternative compliance method), a description of the estimation method and reasons for using it are recorded in the evidence pack',
    );
  });
});
