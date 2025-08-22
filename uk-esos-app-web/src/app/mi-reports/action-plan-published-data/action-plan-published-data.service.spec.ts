import { TestBed } from '@angular/core/testing';

import { ActionPlanPublishedDataResult } from './action-plan-published-data.interfaces';
import {
  actionPlansTabHeaderMap,
  confirmationTabHeaderMap,
  measuresTabHeaderMap,
  tableOfContentTabHeaderMap,
} from './action-plan-published-data.maps';
import { ActionPlanPublishedDataService } from './action-plan-published-data.service';
import { mockActionPlanPublishedDataResult } from './action-plan-published-mock-data';

class ActionPlanPublishedDataServiceTestWrapper extends ActionPlanPublishedDataService {
  public createTableOfContentsTabData(): { [key: string]: string }[] {
    return super['_createTableOfContentsTabData']();
  }
  public createActionPlansTabData(result: ActionPlanPublishedDataResult): { [key: string]: string }[] {
    return super['_createActionPlansTabData'](result);
  }
  public createMeasuresTabData(result: ActionPlanPublishedDataResult): { [key: string]: string }[] {
    return super['_createMeasuresTabData'](result);
  }
  public createConfirmationTabData(result: ActionPlanPublishedDataResult): { [key: string]: string }[] {
    return super['_createConfirmationTabData'](result);
  }
}

describe('ActionPlanPublishedDataService', () => {
  let service: ActionPlanPublishedDataService;
  const serviceWrapper = new ActionPlanPublishedDataServiceTestWrapper();

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionPlanPublishedDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate Table of Contents sheet rows', () => {
    expect(serviceWrapper.createTableOfContentsTabData()).toEqual([
      {
        [tableOfContentTabHeaderMap.sheet]: 'Action Plans',
        [tableOfContentTabHeaderMap.description]: '',
      },
      {
        [tableOfContentTabHeaderMap.sheet]: 'Energy Efficiency Measures',
        [tableOfContentTabHeaderMap.description]: '',
      },
      {
        [tableOfContentTabHeaderMap.sheet]: 'Resp. officer confirmation',
        [tableOfContentTabHeaderMap.description]: '',
      },
    ]);
  });

  it('should generate Action Plans sheet rows', () => {
    expect(serviceWrapper.createActionPlansTabData(mockActionPlanPublishedDataResult)).toEqual([
      {
        [actionPlansTabHeaderMap.apId]: 'AP000003-P3',
        [actionPlansTabHeaderMap.organisationName]: 'The Org 000',
        [actionPlansTabHeaderMap.companyRegistrationNumber]: undefined,
        [actionPlansTabHeaderMap.apSubmissionDate]: '',
        [actionPlansTabHeaderMap.nocId]: undefined,
        [actionPlansTabHeaderMap.nocSubmissionDate]: '',
        [actionPlansTabHeaderMap.haveEnergyEfficiencyMeasures]: 'No',
        [actionPlansTabHeaderMap.noMeasureContext]: undefined,
      },
      {
        [actionPlansTabHeaderMap.apId]: 'AP000004-P3',
        [actionPlansTabHeaderMap.organisationName]: 'The Org 00',
        [actionPlansTabHeaderMap.companyRegistrationNumber]: undefined,
        [actionPlansTabHeaderMap.apSubmissionDate]: '4 Oct 2024',
        [actionPlansTabHeaderMap.nocId]: 'NOC000004-P3',
        [actionPlansTabHeaderMap.nocSubmissionDate]: '16 Oct 2024',
        [actionPlansTabHeaderMap.haveEnergyEfficiencyMeasures]: 'Yes',
        [actionPlansTabHeaderMap.noMeasureContext]: undefined,
      },
      {
        [actionPlansTabHeaderMap.apId]: 'AP000005-P3',
        [actionPlansTabHeaderMap.organisationName]: 'The Org IM4',
        [actionPlansTabHeaderMap.companyRegistrationNumber]: '12580944',
        [actionPlansTabHeaderMap.apSubmissionDate]: '27 Nov 2024',
        [actionPlansTabHeaderMap.nocId]: undefined,
        [actionPlansTabHeaderMap.nocSubmissionDate]: '',
        [actionPlansTabHeaderMap.haveEnergyEfficiencyMeasures]: 'No',
        [actionPlansTabHeaderMap.noMeasureContext]: 'This is the no measure context',
      },
      {
        [actionPlansTabHeaderMap.apId]: 'AP000006-P3',
        [actionPlansTabHeaderMap.organisationName]: 'The Org VI',
        [actionPlansTabHeaderMap.companyRegistrationNumber]: undefined,
        [actionPlansTabHeaderMap.apSubmissionDate]: '27 Nov 2024',
        [actionPlansTabHeaderMap.nocId]: undefined,
        [actionPlansTabHeaderMap.nocSubmissionDate]: '',
        [actionPlansTabHeaderMap.haveEnergyEfficiencyMeasures]: 'Yes',
        [actionPlansTabHeaderMap.noMeasureContext]: undefined,
      },
    ]);
  });

  it('should generate Energy Efficiency Measures sheet rows', () => {
    expect(serviceWrapper.createMeasuresTabData(mockActionPlanPublishedDataResult)).toEqual([
      {
        [measuresTabHeaderMap.apId]: 'AP000004-P3',
        [measuresTabHeaderMap.measureName]: 'Lorem ipsum III',
        [measuresTabHeaderMap.isEnergySavingsOpportunityReportedInAudit]: 'Yes',
        [measuresTabHeaderMap.measureScheme]: 'Streamlined Energy and Carbon Reporting (SECR); UN Race to Zero',
        [measuresTabHeaderMap.implementationDateForMeasure]: '03-2024',
        [measuresTabHeaderMap.savingsEstimateBuildings]: '1',
        [measuresTabHeaderMap.savingsEstimateTransport]: '2',
        [measuresTabHeaderMap.savingsEstimateIndustrial]: '0',
        [measuresTabHeaderMap.savingsEstimateOther]: '0',
        [measuresTabHeaderMap.savingsEstimateTotal]: '3',
        [measuresTabHeaderMap.energySavingsEstimateCalculatedType]: 'Some other reasonable estimation method',
        [measuresTabHeaderMap.estimationMethodDescription]: 'The other method name',
        [measuresTabHeaderMap.measureContext]: 'Post nubila phoebus',
      },
      {
        [measuresTabHeaderMap.apId]: 'AP000004-P3',
        [measuresTabHeaderMap.measureName]: 'Lorem ipsum 44',
        [measuresTabHeaderMap.isEnergySavingsOpportunityReportedInAudit]: 'No',
        [measuresTabHeaderMap.measureScheme]: '',
        [measuresTabHeaderMap.implementationDateForMeasure]: '02-2026',
        [measuresTabHeaderMap.savingsEstimateBuildings]: '1',
        [measuresTabHeaderMap.savingsEstimateTransport]: '2',
        [measuresTabHeaderMap.savingsEstimateIndustrial]: '0',
        [measuresTabHeaderMap.savingsEstimateOther]: '4444',
        [measuresTabHeaderMap.savingsEstimateTotal]: '4447',
        [measuresTabHeaderMap.energySavingsEstimateCalculatedType]: 'An energy audit',
        [measuresTabHeaderMap.estimationMethodDescription]: undefined,
        [measuresTabHeaderMap.measureContext]: undefined,
      },
      {
        [measuresTabHeaderMap.apId]: 'AP000006-P3',
        [measuresTabHeaderMap.measureName]: 'Dorem!',
        [measuresTabHeaderMap.isEnergySavingsOpportunityReportedInAudit]: 'Yes',
        [measuresTabHeaderMap.measureScheme]:
          'Climate Change Agreements (CCAs); Streamlined Energy and Carbon Reporting (SECR); UK Emissions Trading Scheme (ETS); UN Race to Zero; Science-Based Targets Initiative (SBTi); Carbon Reduction Plans (required in the procurement of major Government contracts); Other: The Other scheme name',
        [measuresTabHeaderMap.implementationDateForMeasure]: '12-2025',
        [measuresTabHeaderMap.savingsEstimateBuildings]: '233',
        [measuresTabHeaderMap.savingsEstimateTransport]: '0',
        [measuresTabHeaderMap.savingsEstimateIndustrial]: '3232',
        [measuresTabHeaderMap.savingsEstimateOther]: '0',
        [measuresTabHeaderMap.savingsEstimateTotal]: '3465',
        [measuresTabHeaderMap.energySavingsEstimateCalculatedType]: 'An alternative compliance method',
        [measuresTabHeaderMap.estimationMethodDescription]: undefined,
        [measuresTabHeaderMap.measureContext]: 'Another measure context string',
      },
    ]);
  });

  it('should generate Resp. officer confirmation sheet rows', () => {
    expect(serviceWrapper.createConfirmationTabData(mockActionPlanPublishedDataResult)).toEqual([
      {
        [confirmationTabHeaderMap.apId]: 'AP000003-P3',
        [confirmationTabHeaderMap.esosAssessment]: 'Yes',
        [confirmationTabHeaderMap.estimationMethod]: '',
      },
      {
        [confirmationTabHeaderMap.apId]: 'AP000004-P3',
        [confirmationTabHeaderMap.esosAssessment]: 'Yes',
        [confirmationTabHeaderMap.estimationMethod]: 'Yes',
      },
      {
        [confirmationTabHeaderMap.apId]: 'AP000005-P3',
        [confirmationTabHeaderMap.esosAssessment]: 'Yes',
        [confirmationTabHeaderMap.estimationMethod]: '',
      },
      {
        [confirmationTabHeaderMap.apId]: 'AP000006-P3',
        [confirmationTabHeaderMap.esosAssessment]: 'Yes',
        [confirmationTabHeaderMap.estimationMethod]: '',
      },
    ]);
  });
});
