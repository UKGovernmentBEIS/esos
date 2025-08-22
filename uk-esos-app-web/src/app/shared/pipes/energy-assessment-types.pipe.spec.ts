import { EnergyAssessmentTypesPipe } from './energy-assessment-types.pipe';

describe('EnergyAssessmentTypesPipe', () => {
  const pipe = new EnergyAssessmentTypesPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform energy assesment types', () => {
    let transformation: string;

    transformation = pipe.transform('SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME');
    expect(transformation).toEqual('the organisation is within scope of the scheme');

    transformation = pipe.transform('SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME', true);
    expect(transformation).toEqual(
      'the organisation is within scope of the scheme but does not have any energy responsibility',
    );

    transformation = pipe.transform('SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME');
    expect(transformation).toEqual('the organisation is compliant with the scheme');

    transformation = pipe.transform('SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON');
    expect(transformation).toEqual(
      'the relevant sections of the ESOS report have been shared with all undertakings in the corporate group, unless there is a declared reason why this is prohibited by law',
    );

    transformation = pipe.transform('SATISFIED_WITH_INFORMATION_PROVIDED');
    expect(transformation).toEqual('the information provided in this notification of compliance is correct');
  });
});
