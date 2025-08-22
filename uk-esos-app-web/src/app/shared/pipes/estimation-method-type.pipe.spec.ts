import { EstimationMethodTypePipe } from './estimation-method-type.pipe';

describe('EstimationMethodTypePipe', () => {
  const pipe = new EstimationMethodTypePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform', () => {
    let transformation: string;

    transformation = pipe.transform('ENERGY_AUDIT');
    expect(transformation).toEqual('an energy audit');
    transformation = pipe.transform('ALTERNATIVE_COMPLIANCE_METHOD');
    expect(transformation).toEqual('an alternative compliance method');
    transformation = pipe.transform('OTHER_REASONABLE_ESTIMATION_METHOD');
    expect(transformation).toEqual('some other reasonable estimation method');
    transformation = pipe.transform('OTHER_METHOD');
    expect(transformation).toEqual('some other reasonable estimation method');
    transformation = pipe.transform('NO_METHOD_USED');
    expect(transformation).toEqual('no estimation method used');

    transformation = pipe.transform('ENERGY_AUDIT', 'summary');
    expect(transformation).toEqual('Energy audit');
    transformation = pipe.transform('ALTERNATIVE_COMPLIANCE_METHOD', 'summary');
    expect(transformation).toEqual('Alternative compliance method');
    transformation = pipe.transform('OTHER_REASONABLE_ESTIMATION_METHOD', 'summary');
    expect(transformation).toEqual('Other estimation method');
    transformation = pipe.transform('OTHER_METHOD', 'summary');
    expect(transformation).toEqual('Other estimation method');
    transformation = pipe.transform('NO_METHOD_USED', 'summary');
    expect(transformation).toEqual('No estimation method used');
  });
});
