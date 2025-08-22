import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'measureScheme', standalone: true, pure: true })
export class MeasureSchemePipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    switch (value) {
      case 'CLIMATE_CHANGE_AGREEMENTS_CCA':
        return 'Climate Change Agreements (CCAs)';
      case 'STREAMLINED_ENERGY_AND_CARBON_REPORTING_SECR':
        return 'Streamlined Energy and Carbon Reporting (SECR)';
      case 'UK_EMISSIONS_TRADING_SCHEME_ETS':
        return 'UK Emissions Trading Scheme (ETS)';
      case 'UN_RACE_TO_ZERO':
        return 'UN Race to Zero';
      case 'SCIENCE_BASED_TARGETS_INITIATIVE_SBTI':
        return 'Science-Based Targets Initiative (SBTi)';
      case 'CARBON_REDUCTION_PLANS':
        return 'Carbon Reduction Plans (required in the procurement of major Government contracts)';
      case 'OTHER':
        return 'Other';
      default:
        return null;
    }
  }
}
