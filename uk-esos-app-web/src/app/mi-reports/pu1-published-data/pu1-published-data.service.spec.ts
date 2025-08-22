import { TestBed } from '@angular/core/testing';

import { ProgressUpdate1PublishedDataResult } from './pu1-published-data.interfaces';
import {
  confirmationTabHeaderMap,
  measuresTabHeaderMap,
  progressUpdatesTabHeaderMap,
  tableOfContentTabHeaderMap,
} from './pu1-published-data.maps';
import { ProgressUpdate1PublishedDataService } from './pu1-published-data.service';
import { mockProgressUpdate1PublishedDataResult } from './pu1-published-mock-data';

class ProgressUpdate1PublishedDataServiceTestWrapper extends ProgressUpdate1PublishedDataService {
  public createTableOfContentsTabData(): { [key: string]: string }[] {
    return super['_createTableOfContentsTabData']();
  }
  public createProgressUpdatesTabData(result: ProgressUpdate1PublishedDataResult): { [key: string]: string }[] {
    return super['_createProgressUpdatesTabData'](result);
  }
  public createMeasuresTabData(result: ProgressUpdate1PublishedDataResult): { [key: string]: string }[] {
    return super['_createMeasuresTabData'](result);
  }
  public createConfirmationTabData(result: ProgressUpdate1PublishedDataResult): { [key: string]: string }[] {
    return super['_createConfirmationTabData'](result);
  }
}

describe('ProgressUpdate1PublishedDataService', () => {
  let service: ProgressUpdate1PublishedDataService;
  const serviceWrapper = new ProgressUpdate1PublishedDataServiceTestWrapper();

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressUpdate1PublishedDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate Table of Contents sheet rows', () => {
    expect(serviceWrapper.createTableOfContentsTabData()).toEqual([
      {
        [tableOfContentTabHeaderMap.sheet]: 'Progress Updates',
        [tableOfContentTabHeaderMap.description]: '',
      },
      {
        [tableOfContentTabHeaderMap.sheet]: 'UpdatesEnergyEfficiencyMeasures',
        [tableOfContentTabHeaderMap.description]: 'Update for Energy Efficiency Measures',
      },
      {
        [tableOfContentTabHeaderMap.sheet]: 'Resp. officer confirmation',
        [tableOfContentTabHeaderMap.description]: 'Responsible officer confirmation',
      },
    ]);
  });

  it('should generate Progress Updates sheet rows', () => {
    expect(serviceWrapper.createProgressUpdatesTabData(mockProgressUpdate1PublishedDataResult)).toEqual([
      {
        [progressUpdatesTabHeaderMap.pu1Id]: 'PU1000005-P3',
        [progressUpdatesTabHeaderMap.organisationName]: 'The Org 4',
        [progressUpdatesTabHeaderMap.companyRegistrationNumber]: '12580944',
        [progressUpdatesTabHeaderMap.pu1SubmissionDate]: '12 Mar 2025',
        [progressUpdatesTabHeaderMap.apId]: 'AP000005-P3',
        [progressUpdatesTabHeaderMap.apSubmissionDate]: '27 Nov 2024',
        [progressUpdatesTabHeaderMap.otherResponsibleUndertakingName]: '',
        [progressUpdatesTabHeaderMap.otherResponsibleUndertakingCrn]: '',
      },
      {
        [progressUpdatesTabHeaderMap.pu1Id]: 'PU1000006-P3',
        [progressUpdatesTabHeaderMap.organisationName]: 'The Org VI',
        [progressUpdatesTabHeaderMap.companyRegistrationNumber]: '12580945',
        [progressUpdatesTabHeaderMap.pu1SubmissionDate]: '6 Mar 2025',
        [progressUpdatesTabHeaderMap.apId]: 'AP000006-P3',
        [progressUpdatesTabHeaderMap.apSubmissionDate]: '3 Jan 2025',
        [progressUpdatesTabHeaderMap.otherResponsibleUndertakingName]: '',
        [progressUpdatesTabHeaderMap.otherResponsibleUndertakingCrn]: '',
      },
      {
        [progressUpdatesTabHeaderMap.pu1Id]: 'PU1000010-P3',
        [progressUpdatesTabHeaderMap.organisationName]: '10th ORG',
        [progressUpdatesTabHeaderMap.companyRegistrationNumber]: '12580946',
        [progressUpdatesTabHeaderMap.pu1SubmissionDate]: '14 Mar 2025',
        [progressUpdatesTabHeaderMap.apId]: 'AP000010-P3',
        [progressUpdatesTabHeaderMap.apSubmissionDate]: '14 Mar 2025',
        [progressUpdatesTabHeaderMap.otherResponsibleUndertakingName]: '',
        [progressUpdatesTabHeaderMap.otherResponsibleUndertakingCrn]: '',
      },
      {
        [progressUpdatesTabHeaderMap.pu1Id]: 'PU1000011-P3',
        [progressUpdatesTabHeaderMap.organisationName]: 'The 11 DisOrg PU1',
        [progressUpdatesTabHeaderMap.companyRegistrationNumber]: '',
        [progressUpdatesTabHeaderMap.pu1SubmissionDate]: '2 Apr 2025',
        [progressUpdatesTabHeaderMap.apId]: '',
        [progressUpdatesTabHeaderMap.apSubmissionDate]: '',
        [progressUpdatesTabHeaderMap.otherResponsibleUndertakingName]: 'Old RU group name',
        [progressUpdatesTabHeaderMap.otherResponsibleUndertakingCrn]: '12334',
      },
    ]);
  });

  it('should generate Update for Energy Efficiency Measures sheet rows', () => {
    expect(serviceWrapper.createMeasuresTabData(mockProgressUpdate1PublishedDataResult)).toEqual([
      {
        [measuresTabHeaderMap.pu1Id]: 'PU1000005-P3',
        [measuresTabHeaderMap.measureName]: 'N1',
        [measuresTabHeaderMap.isPu1AddedMeasure]: 'Yes',
        [measuresTabHeaderMap.totalEnergySavings]: '',
        [measuresTabHeaderMap.measureScheme]:
          'Climate Change Agreements (CCAs); Streamlined Energy and Carbon Reporting (SECR)',
        [measuresTabHeaderMap.measureIsImplemented]: '',
        [measuresTabHeaderMap.measureImplementedByTheDateInActionPlan]: '',
        [measuresTabHeaderMap.reportReduction2024To2025]: null,
        [measuresTabHeaderMap.reductionEnergyConsumption2024To2025]: '22',
        [measuresTabHeaderMap.reportReduction2023To2024]: null,
        [measuresTabHeaderMap.reductionEnergyConsumption2023To2024]: '',
        [measuresTabHeaderMap.estimationMethodType]: 'Energy audit',
        [measuresTabHeaderMap.estimationMethodDescription]: '',
        [measuresTabHeaderMap.measureContext]: undefined,
      },
      {
        [measuresTabHeaderMap.pu1Id]: 'PU1000006-P3',
        [measuresTabHeaderMap.measureName]: 'Msr name (before AP sub)',
        [measuresTabHeaderMap.isPu1AddedMeasure]: 'No',
        [measuresTabHeaderMap.totalEnergySavings]: '3465',
        [measuresTabHeaderMap.measureScheme]: '',
        [measuresTabHeaderMap.measureIsImplemented]: '',
        [measuresTabHeaderMap.measureImplementedByTheDateInActionPlan]: 'Yes',
        [measuresTabHeaderMap.reportReduction2024To2025]: 'Yes',
        [measuresTabHeaderMap.reductionEnergyConsumption2024To2025]: '1111',
        [measuresTabHeaderMap.reportReduction2023To2024]: 'No',
        [measuresTabHeaderMap.reductionEnergyConsumption2023To2024]: '',
        [measuresTabHeaderMap.estimationMethodType]: 'Energy audit',
        [measuresTabHeaderMap.estimationMethodDescription]: '',
        [measuresTabHeaderMap.measureContext]: 'Some ctx',
      },
      {
        [measuresTabHeaderMap.pu1Id]: 'PU1000006-P3',
        [measuresTabHeaderMap.measureName]: 'M22',
        [measuresTabHeaderMap.isPu1AddedMeasure]: 'No',
        [measuresTabHeaderMap.totalEnergySavings]: '78',
        [measuresTabHeaderMap.measureScheme]: '',
        [measuresTabHeaderMap.measureIsImplemented]: 'No',
        [measuresTabHeaderMap.measureImplementedByTheDateInActionPlan]: null,
        [measuresTabHeaderMap.reportReduction2024To2025]: null,
        [measuresTabHeaderMap.reductionEnergyConsumption2024To2025]: '',
        [measuresTabHeaderMap.reportReduction2023To2024]: null,
        [measuresTabHeaderMap.reductionEnergyConsumption2023To2024]: '',
        [measuresTabHeaderMap.estimationMethodType]: '',
        [measuresTabHeaderMap.estimationMethodDescription]: '',
        [measuresTabHeaderMap.measureContext]: 'Not yet implemented context',
      },
      {
        [measuresTabHeaderMap.pu1Id]: 'PU1000006-P3',
        [measuresTabHeaderMap.measureName]: 'M3',
        [measuresTabHeaderMap.isPu1AddedMeasure]: 'No',
        [measuresTabHeaderMap.totalEnergySavings]: '45645',
        [measuresTabHeaderMap.measureScheme]: '',
        [measuresTabHeaderMap.measureIsImplemented]: 'Yes',
        [measuresTabHeaderMap.measureImplementedByTheDateInActionPlan]: 'No',
        [measuresTabHeaderMap.reportReduction2024To2025]: null,
        [measuresTabHeaderMap.reductionEnergyConsumption2024To2025]: '22222',
        [measuresTabHeaderMap.reportReduction2023To2024]: null,
        [measuresTabHeaderMap.reductionEnergyConsumption2023To2024]: '343',
        [measuresTabHeaderMap.estimationMethodType]: 'Estimate in the action plan',
        [measuresTabHeaderMap.estimationMethodDescription]: '',
        [measuresTabHeaderMap.measureContext]: undefined,
      },
      {
        [measuresTabHeaderMap.pu1Id]: 'PU1000006-P3',
        [measuresTabHeaderMap.measureName]: 'M4 (before AP sub)',
        [measuresTabHeaderMap.isPu1AddedMeasure]: 'No',
        [measuresTabHeaderMap.totalEnergySavings]: '111',
        [measuresTabHeaderMap.measureScheme]: '',
        [measuresTabHeaderMap.measureIsImplemented]: '',
        [measuresTabHeaderMap.measureImplementedByTheDateInActionPlan]: 'Yes',
        [measuresTabHeaderMap.reportReduction2024To2025]: 'No',
        [measuresTabHeaderMap.reductionEnergyConsumption2024To2025]: '',
        [measuresTabHeaderMap.reportReduction2023To2024]: 'No',
        [measuresTabHeaderMap.reductionEnergyConsumption2023To2024]: '',
        [measuresTabHeaderMap.estimationMethodType]: '',
        [measuresTabHeaderMap.estimationMethodDescription]: '',
        [measuresTabHeaderMap.measureContext]: undefined,
      },
      {
        [measuresTabHeaderMap.pu1Id]: 'PU1000006-P3',
        [measuresTabHeaderMap.measureName]: 'New PU1 measure A',
        [measuresTabHeaderMap.isPu1AddedMeasure]: 'Yes',
        [measuresTabHeaderMap.totalEnergySavings]: '',
        [measuresTabHeaderMap.measureScheme]:
          'Climate Change Agreements (CCAs); Streamlined Energy and Carbon Reporting (SECR); UK Emissions Trading Scheme (ETS); UN Race to Zero; Science-Based Targets Initiative (SBTi); Carbon Reduction Plans (required in the procurement of major Government contracts); Other: Grapes Vines Scheme',
        [measuresTabHeaderMap.measureIsImplemented]: '',
        [measuresTabHeaderMap.measureImplementedByTheDateInActionPlan]: '',
        [measuresTabHeaderMap.reportReduction2024To2025]: null,
        [measuresTabHeaderMap.reductionEnergyConsumption2024To2025]: '3453',
        [measuresTabHeaderMap.reportReduction2023To2024]: null,
        [measuresTabHeaderMap.reductionEnergyConsumption2023To2024]: '',
        [measuresTabHeaderMap.estimationMethodType]: 'Other estimation method',
        [measuresTabHeaderMap.estimationMethodDescription]: 'GG. Description.',
        [measuresTabHeaderMap.measureContext]: 'New msr ctx',
      },
      {
        [measuresTabHeaderMap.pu1Id]: 'PU1000006-P3',
        [measuresTabHeaderMap.measureName]: 'New PU1 measure B',
        [measuresTabHeaderMap.isPu1AddedMeasure]: 'Yes',
        [measuresTabHeaderMap.totalEnergySavings]: '',
        [measuresTabHeaderMap.measureScheme]: '',
        [measuresTabHeaderMap.measureIsImplemented]: '',
        [measuresTabHeaderMap.measureImplementedByTheDateInActionPlan]: '',
        [measuresTabHeaderMap.reportReduction2024To2025]: null,
        [measuresTabHeaderMap.reductionEnergyConsumption2024To2025]: '112',
        [measuresTabHeaderMap.reportReduction2023To2024]: null,
        [measuresTabHeaderMap.reductionEnergyConsumption2023To2024]: '',
        [measuresTabHeaderMap.estimationMethodType]: 'No estimation method used',
        [measuresTabHeaderMap.estimationMethodDescription]: '',
        [measuresTabHeaderMap.measureContext]: undefined,
      },
      {
        [measuresTabHeaderMap.pu1Id]: 'PU1000010-P3',
        [measuresTabHeaderMap.measureName]: 'M1',
        [measuresTabHeaderMap.isPu1AddedMeasure]: 'No',
        [measuresTabHeaderMap.totalEnergySavings]: '1222',
        [measuresTabHeaderMap.measureScheme]: '',
        [measuresTabHeaderMap.measureIsImplemented]: 'No',
        [measuresTabHeaderMap.measureImplementedByTheDateInActionPlan]: null,
        [measuresTabHeaderMap.reportReduction2024To2025]: null,
        [measuresTabHeaderMap.reductionEnergyConsumption2024To2025]: '',
        [measuresTabHeaderMap.reportReduction2023To2024]: null,
        [measuresTabHeaderMap.reductionEnergyConsumption2023To2024]: '',
        [measuresTabHeaderMap.estimationMethodType]: '',
        [measuresTabHeaderMap.estimationMethodDescription]: '',
        [measuresTabHeaderMap.measureContext]: undefined,
      },
      {
        [measuresTabHeaderMap.pu1Id]: 'PU1000011-P3',
        [measuresTabHeaderMap.measureName]: 'DU New Msr 1',
        [measuresTabHeaderMap.isPu1AddedMeasure]: 'Yes',
        [measuresTabHeaderMap.totalEnergySavings]: '',
        [measuresTabHeaderMap.measureScheme]:
          'Carbon Reduction Plans (required in the procurement of major Government contracts); Other: Apple pear cherry',
        [measuresTabHeaderMap.measureIsImplemented]: '',
        [measuresTabHeaderMap.measureImplementedByTheDateInActionPlan]: '',
        [measuresTabHeaderMap.reportReduction2024To2025]: null,
        [measuresTabHeaderMap.reductionEnergyConsumption2024To2025]: '1232',
        [measuresTabHeaderMap.reportReduction2023To2024]: null,
        [measuresTabHeaderMap.reductionEnergyConsumption2023To2024]: '43454',
        [measuresTabHeaderMap.estimationMethodType]: 'No estimation method used',
        [measuresTabHeaderMap.estimationMethodDescription]: '',
        [measuresTabHeaderMap.measureContext]: undefined,
      },
    ]);
  });

  it('should generate Resp. officer confirmation sheet rows', () => {
    expect(serviceWrapper.createConfirmationTabData(mockProgressUpdate1PublishedDataResult)).toEqual([
      {
        [confirmationTabHeaderMap.pu1Id]: 'PU1000005-P3',
        [confirmationTabHeaderMap.esosAssessment]: 'Yes',
        [confirmationTabHeaderMap.estimationMethod]: '',
      },
      {
        [confirmationTabHeaderMap.pu1Id]: 'PU1000006-P3',
        [confirmationTabHeaderMap.esosAssessment]: 'Yes',
        [confirmationTabHeaderMap.estimationMethod]: 'Yes',
      },
      {
        [confirmationTabHeaderMap.pu1Id]: 'PU1000010-P3',
        [confirmationTabHeaderMap.esosAssessment]: 'Yes',
        [confirmationTabHeaderMap.estimationMethod]: '',
      },
      {
        [confirmationTabHeaderMap.pu1Id]: 'PU1000011-P3',
        [confirmationTabHeaderMap.esosAssessment]: 'Yes',
        [confirmationTabHeaderMap.estimationMethod]: '',
      },
    ]);
  });
});
