import { ProgressUpdate2P3 } from 'esos-api';

export interface ProgressUpdate2PublishedDataResult {
  progressUpdate2SearchResultsInfos: ProgressUpdate2SearchResultsInfo[];
}

export interface ProgressUpdate2SearchResultsInfo {
  pu2Id: string;
  progressUpdate2Container: {
    phase: string;
    progressUpdate2P3: ProgressUpdate2P3;
  };
  organisationName: string;
  location: string;
  registrationNumber?: string;
  pu2SubmitDate?: string;
  actionPlanId?: string;
  actionPlanSubmitDate?: string;
  pu1Id?: string;
  pu1SubmitDate?: string;
}
