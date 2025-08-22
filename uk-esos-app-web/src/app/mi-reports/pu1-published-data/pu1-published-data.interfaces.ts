import { ProgressUpdate1P3 } from 'esos-api';

export interface ProgressUpdate1PublishedDataResult {
  progressUpdate1SearchResultsInfos: ProgressUpdate1SearchResultsInfo[];
}

export interface ProgressUpdate1SearchResultsInfo {
  pu1Id: string;
  progressUpdate1Container: {
    phase: string;
    progressUpdate1P3: ProgressUpdate1P3;
  };
  organisationName: string;
  location: string;
  registrationNumber?: string;
  pu1SubmitDate?: string;
  actionPlanId?: string;
  actionPlanSubmitDate?: string;
}
