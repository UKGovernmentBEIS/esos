import { MeasureSchemePipe } from './measure-scheme.pipe';

describe('MeasureSchemePipe', () => {
  const pipe = new MeasureSchemePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should properly transform', () => {
    let transformation: string;

    transformation = pipe.transform('CLIMATE_CHANGE_AGREEMENTS_CCA');
    expect(transformation).toEqual('Climate Change Agreements (CCAs)');
    transformation = pipe.transform('STREAMLINED_ENERGY_AND_CARBON_REPORTING_SECR');
    expect(transformation).toEqual('Streamlined Energy and Carbon Reporting (SECR)');
    transformation = pipe.transform('UK_EMISSIONS_TRADING_SCHEME_ETS');
    expect(transformation).toEqual('UK Emissions Trading Scheme (ETS)');
    transformation = pipe.transform('UN_RACE_TO_ZERO');
    expect(transformation).toEqual('UN Race to Zero');
    transformation = pipe.transform('SCIENCE_BASED_TARGETS_INITIATIVE_SBTI');
    expect(transformation).toEqual('Science-Based Targets Initiative (SBTi)');
    transformation = pipe.transform('CARBON_REDUCTION_PLANS');
    expect(transformation).toEqual(
      'Carbon Reduction Plans (required in the procurement of major Government contracts)',
    );
    transformation = pipe.transform('OTHER');
    expect(transformation).toEqual('Other');
  });
});
