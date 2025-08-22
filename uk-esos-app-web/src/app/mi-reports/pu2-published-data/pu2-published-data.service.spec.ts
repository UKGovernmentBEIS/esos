import { TestBed } from '@angular/core/testing';

import { ProgressUpdate2PublishedDataResult } from './pu2-published-data.interfaces';
import {
  confirmationTabHeaderMap,
  measuresTabHeaderMap,
  progressUpdatesTabHeaderMap,
  tableOfContentTabHeaderMap,
} from './pu2-published-data.maps';
import { ProgressUpdate2PublishedDataService } from './pu2-published-data.service';
import { mockProgressUpdate2PublishedDataResult } from './pu2-published-mock-data';

class ProgressUpdate2PublishedDataServiceTestWrapper extends ProgressUpdate2PublishedDataService {
  public createTableOfContentsTabData(): { [key: string]: string }[] {
    return super['_createTableOfContentsTabData']();
  }
  public createProgressUpdatesTabData(result: ProgressUpdate2PublishedDataResult): { [key: string]: string }[] {
    return super['_createProgressUpdatesTabData'](result);
  }
  public createMeasuresTabData(result: ProgressUpdate2PublishedDataResult): { [key: string]: string }[] {
    return super['_createMeasuresTabData'](result);
  }
  public createConfirmationTabData(result: ProgressUpdate2PublishedDataResult): { [key: string]: string }[] {
    return super['_createConfirmationTabData'](result);
  }
}

describe('ProgressUpdate2PublishedDataService', () => {
  let service: ProgressUpdate2PublishedDataService;
  const serviceWrapper = new ProgressUpdate2PublishedDataServiceTestWrapper();

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressUpdate2PublishedDataService);
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
    expect(serviceWrapper.createProgressUpdatesTabData(mockProgressUpdate2PublishedDataResult)).toEqual([
      {
        [progressUpdatesTabHeaderMap.pu2Id]: 'PU2000005-P3',
        [progressUpdatesTabHeaderMap.pu2SubmissionDate]: '2 Apr 2025',
        [progressUpdatesTabHeaderMap.organisationName]: 'The Org IM4',
        [progressUpdatesTabHeaderMap.companyRegistrationNumber]: '12580944',
        [progressUpdatesTabHeaderMap.apId]: 'AP000005-P3',
        [progressUpdatesTabHeaderMap.apSubmissionDate]: '27 Nov 2024',
        [progressUpdatesTabHeaderMap.pu1Id]: 'PU1000005-P3',
        [progressUpdatesTabHeaderMap.pu1SubmissionDate]: '2 Apr 2025',
        [progressUpdatesTabHeaderMap.otherResponsibleUndertakingName]: '',
        [progressUpdatesTabHeaderMap.otherResponsibleUndertakingCrn]: '',
      },
      {
        [progressUpdatesTabHeaderMap.pu2Id]: 'PU2000006-P3',
        [progressUpdatesTabHeaderMap.pu2SubmissionDate]: '14 Mar 2025',
        [progressUpdatesTabHeaderMap.organisationName]: 'The Org VI',
        [progressUpdatesTabHeaderMap.companyRegistrationNumber]: '12580945',
        [progressUpdatesTabHeaderMap.apId]: 'AP000006-P3',
        [progressUpdatesTabHeaderMap.apSubmissionDate]: '3 Jan 2025',
        [progressUpdatesTabHeaderMap.pu1Id]: 'PU1000006-P3',
        [progressUpdatesTabHeaderMap.pu1SubmissionDate]: '6 Mar 2025',
        [progressUpdatesTabHeaderMap.otherResponsibleUndertakingName]: '',
        [progressUpdatesTabHeaderMap.otherResponsibleUndertakingCrn]: '',
      },
      {
        [progressUpdatesTabHeaderMap.pu2Id]: 'PU2000008-P3',
        [progressUpdatesTabHeaderMap.pu2SubmissionDate]: '2 Apr 2025',
        [progressUpdatesTabHeaderMap.organisationName]: 'The 8th DisORG',
        [progressUpdatesTabHeaderMap.companyRegistrationNumber]: '12580946',
        [progressUpdatesTabHeaderMap.apId]: '',
        [progressUpdatesTabHeaderMap.apSubmissionDate]: '',
        [progressUpdatesTabHeaderMap.pu1Id]: '',
        [progressUpdatesTabHeaderMap.pu1SubmissionDate]: '',
        [progressUpdatesTabHeaderMap.otherResponsibleUndertakingName]: 'The other RU',
        [progressUpdatesTabHeaderMap.otherResponsibleUndertakingCrn]: '678686',
      },
      {
        [progressUpdatesTabHeaderMap.pu2Id]: 'PU2000010-P3',
        [progressUpdatesTabHeaderMap.pu2SubmissionDate]: '14 Mar 2025',
        [progressUpdatesTabHeaderMap.organisationName]: '10th ORG',
        [progressUpdatesTabHeaderMap.companyRegistrationNumber]: '',
        [progressUpdatesTabHeaderMap.apId]: 'AP000010-P3',
        [progressUpdatesTabHeaderMap.apSubmissionDate]: '14 Mar 2025',
        [progressUpdatesTabHeaderMap.pu1Id]: 'PU1000010-P3',
        [progressUpdatesTabHeaderMap.pu1SubmissionDate]: '14 Mar 2025',
        [progressUpdatesTabHeaderMap.otherResponsibleUndertakingName]: '',
        [progressUpdatesTabHeaderMap.otherResponsibleUndertakingCrn]: '',
      },
    ]);
  });

  it('should generate Update for Energy Efficiency Measures sheet rows', () => {
    expect(serviceWrapper.createMeasuresTabData(mockProgressUpdate2PublishedDataResult)).toEqual([
      {
        [measuresTabHeaderMap.pu2Id]: 'PU2000005-P3',
        [measuresTabHeaderMap.measureName]: 'N1',
        [measuresTabHeaderMap.isPu2AddedMeasure]: 'No',
        [measuresTabHeaderMap.measureScheme]: '',
        [measuresTabHeaderMap.measureIsImplemented]: '',
        [measuresTabHeaderMap.measureImplementedByTheDateInActionPlan]: '',
        [measuresTabHeaderMap.reportReduction2025To2026]: 'Yes',
        [measuresTabHeaderMap.reductionEnergyConsumption2025To2026]: '33',
        [measuresTabHeaderMap.estimationMethodType]: 'Energy audit',
        [measuresTabHeaderMap.estimationMethodDescription]: '',
        [measuresTabHeaderMap.measureContext]: 'Strawberry, blueberry',
      },
      {
        [measuresTabHeaderMap.pu2Id]: 'PU2000005-P3',
        [measuresTabHeaderMap.measureName]: 'New PU2 measure F',
        [measuresTabHeaderMap.isPu2AddedMeasure]: 'Yes',
        [measuresTabHeaderMap.measureScheme]:
          'Climate Change Agreements (CCAs); Streamlined Energy and Carbon Reporting (SECR); UK Emissions Trading Scheme (ETS); UN Race to Zero; Science-Based Targets Initiative (SBTi); Carbon Reduction Plans (required in the procurement of major Government contracts); Other: GG55',
        [measuresTabHeaderMap.measureIsImplemented]: '',
        [measuresTabHeaderMap.measureImplementedByTheDateInActionPlan]: '',
        [measuresTabHeaderMap.reportReduction2025To2026]: null,
        [measuresTabHeaderMap.reductionEnergyConsumption2025To2026]: '333',
        [measuresTabHeaderMap.estimationMethodType]: 'No estimation method used',
        [measuresTabHeaderMap.estimationMethodDescription]: '',
        [measuresTabHeaderMap.measureContext]: undefined,
      },
      {
        [measuresTabHeaderMap.pu2Id]: 'PU2000006-P3',
        [measuresTabHeaderMap.measureName]: 'Dorem! (before AP sub)',
        [measuresTabHeaderMap.isPu2AddedMeasure]: 'No',
        [measuresTabHeaderMap.measureScheme]: '',
        [measuresTabHeaderMap.measureIsImplemented]: '',
        [measuresTabHeaderMap.measureImplementedByTheDateInActionPlan]: 'Yes',
        [measuresTabHeaderMap.reportReduction2025To2026]: 'No',
        [measuresTabHeaderMap.reductionEnergyConsumption2025To2026]: '',
        [measuresTabHeaderMap.estimationMethodType]: '',
        [measuresTabHeaderMap.estimationMethodDescription]: '',
        [measuresTabHeaderMap.measureContext]: undefined,
      },
      {
        [measuresTabHeaderMap.pu2Id]: 'PU2000006-P3',
        [measuresTabHeaderMap.measureName]: 'M22',
        [measuresTabHeaderMap.isPu2AddedMeasure]: 'No',
        [measuresTabHeaderMap.measureScheme]: '',
        [measuresTabHeaderMap.measureIsImplemented]: 'Yes',
        [measuresTabHeaderMap.measureImplementedByTheDateInActionPlan]: 'Yes',
        [measuresTabHeaderMap.reportReduction2025To2026]: null,
        [measuresTabHeaderMap.reductionEnergyConsumption2025To2026]: '111',
        [measuresTabHeaderMap.estimationMethodType]: 'Estimate in the action plan',
        [measuresTabHeaderMap.estimationMethodDescription]: '',
        [measuresTabHeaderMap.measureContext]: undefined,
      },
      {
        [measuresTabHeaderMap.pu2Id]: 'PU2000006-P3',
        [measuresTabHeaderMap.measureName]: 'M3',
        [measuresTabHeaderMap.isPu2AddedMeasure]: 'No',
        [measuresTabHeaderMap.measureScheme]: '',
        [measuresTabHeaderMap.measureIsImplemented]: '',
        [measuresTabHeaderMap.measureImplementedByTheDateInActionPlan]: 'No',
        [measuresTabHeaderMap.reportReduction2025To2026]: 'No',
        [measuresTabHeaderMap.reductionEnergyConsumption2025To2026]: '',
        [measuresTabHeaderMap.estimationMethodType]: '',
        [measuresTabHeaderMap.estimationMethodDescription]: '',
        [measuresTabHeaderMap.measureContext]: undefined,
      },
      {
        [measuresTabHeaderMap.pu2Id]: 'PU2000006-P3',
        [measuresTabHeaderMap.measureName]: 'M4 (before AP sub)',
        [measuresTabHeaderMap.isPu2AddedMeasure]: 'No',
        [measuresTabHeaderMap.measureScheme]: '',
        [measuresTabHeaderMap.measureIsImplemented]: '',
        [measuresTabHeaderMap.measureImplementedByTheDateInActionPlan]: 'Yes',
        [measuresTabHeaderMap.reportReduction2025To2026]: 'Yes',
        [measuresTabHeaderMap.reductionEnergyConsumption2025To2026]: '222',
        [measuresTabHeaderMap.estimationMethodType]: 'Energy audit',
        [measuresTabHeaderMap.estimationMethodDescription]: '',
        [measuresTabHeaderMap.measureContext]: undefined,
      },
      {
        [measuresTabHeaderMap.pu2Id]: 'PU2000006-P3',
        [measuresTabHeaderMap.measureName]: 'New PU1 measure A',
        [measuresTabHeaderMap.isPu2AddedMeasure]: 'No',
        [measuresTabHeaderMap.measureScheme]: '',
        [measuresTabHeaderMap.measureIsImplemented]: '',
        [measuresTabHeaderMap.measureImplementedByTheDateInActionPlan]: '',
        [measuresTabHeaderMap.reportReduction2025To2026]: 'No',
        [measuresTabHeaderMap.reductionEnergyConsumption2025To2026]: '',
        [measuresTabHeaderMap.estimationMethodType]: '',
        [measuresTabHeaderMap.estimationMethodDescription]: '',
        [measuresTabHeaderMap.measureContext]: undefined,
      },
      {
        [measuresTabHeaderMap.pu2Id]: 'PU2000006-P3',
        [measuresTabHeaderMap.measureName]: 'New PU1 measure B',
        [measuresTabHeaderMap.isPu2AddedMeasure]: 'No',
        [measuresTabHeaderMap.measureScheme]: '',
        [measuresTabHeaderMap.measureIsImplemented]: '',
        [measuresTabHeaderMap.measureImplementedByTheDateInActionPlan]: '',
        [measuresTabHeaderMap.reportReduction2025To2026]: 'No',
        [measuresTabHeaderMap.reductionEnergyConsumption2025To2026]: '',
        [measuresTabHeaderMap.estimationMethodType]: '',
        [measuresTabHeaderMap.estimationMethodDescription]: '',
        [measuresTabHeaderMap.measureContext]: undefined,
      },
      {
        [measuresTabHeaderMap.pu2Id]: 'PU2000006-P3',
        [measuresTabHeaderMap.measureName]: 'AA',
        [measuresTabHeaderMap.isPu2AddedMeasure]: 'Yes',
        [measuresTabHeaderMap.measureScheme]:
          'Streamlined Energy and Carbon Reporting (SECR); UK Emissions Trading Scheme (ETS); UN Race to Zero',
        [measuresTabHeaderMap.measureIsImplemented]: '',
        [measuresTabHeaderMap.measureImplementedByTheDateInActionPlan]: '',
        [measuresTabHeaderMap.reportReduction2025To2026]: null,
        [measuresTabHeaderMap.reductionEnergyConsumption2025To2026]: '123',
        [measuresTabHeaderMap.estimationMethodType]: 'Other estimation method',
        [measuresTabHeaderMap.estimationMethodDescription]: 'FF',
        [measuresTabHeaderMap.measureContext]: undefined,
      },
      {
        [measuresTabHeaderMap.pu2Id]: 'PU2000010-P3',
        [measuresTabHeaderMap.measureName]: 'M1',
        [measuresTabHeaderMap.isPu2AddedMeasure]: 'No',
        [measuresTabHeaderMap.measureScheme]: '',
        [measuresTabHeaderMap.measureIsImplemented]: 'Yes',
        [measuresTabHeaderMap.measureImplementedByTheDateInActionPlan]: 'Yes',
        [measuresTabHeaderMap.reportReduction2025To2026]: null,
        [measuresTabHeaderMap.reductionEnergyConsumption2025To2026]: '12324',
        [measuresTabHeaderMap.estimationMethodType]: 'Estimate in the action plan',
        [measuresTabHeaderMap.estimationMethodDescription]: '',
        [measuresTabHeaderMap.measureContext]: undefined,
      },
    ]);
  });

  it('should generate Resp. officer confirmation sheet rows', () => {
    expect(serviceWrapper.createConfirmationTabData(mockProgressUpdate2PublishedDataResult)).toEqual([
      {
        [confirmationTabHeaderMap.pu2Id]: 'PU2000005-P3',
        [confirmationTabHeaderMap.esosAssessment]: 'Yes',
        [confirmationTabHeaderMap.estimationMethod]: '',
      },
      {
        [confirmationTabHeaderMap.pu2Id]: 'PU2000006-P3',
        [confirmationTabHeaderMap.esosAssessment]: 'Yes',
        [confirmationTabHeaderMap.estimationMethod]: 'Yes',
      },
      {
        [confirmationTabHeaderMap.pu2Id]: 'PU2000008-P3',
        [confirmationTabHeaderMap.esosAssessment]: 'Yes',
        [confirmationTabHeaderMap.estimationMethod]: '',
      },
      {
        [confirmationTabHeaderMap.pu2Id]: 'PU2000010-P3',
        [confirmationTabHeaderMap.esosAssessment]: 'Yes',
        [confirmationTabHeaderMap.estimationMethod]: '',
      },
    ]);
  });
});
