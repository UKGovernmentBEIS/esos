import { ActionPlanP3 } from 'esos-api';

export interface ActionPlanPublishedDataResult {
  actionPlanSearchResultsInfos: ActionPlanSearchResultsInfo[];
}

export interface ActionPlanSearchResultsInfo {
  actionPlanContainer: {
    actionPlan: ActionPlanP3;
    phase: string;
  };
  actionPlanId: string;
  organisationName: string;
  location: string;
  registrationNumber?: string;
  actionPlanSubmitDate?: string;
  nocId?: string;
  nocSubmitDate?: string;
}
