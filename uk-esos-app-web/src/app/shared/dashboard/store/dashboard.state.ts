import { Paging } from '@shared/interfaces';

import { ItemDTO } from 'esos-api';

export type WorkflowItemsAssignmentType = 'assigned-to-me' | 'assigned-to-others' | 'unassigned';

export interface DashboardState {
  activeTab: WorkflowItemsAssignmentType;
  items: ItemDTO[];
  total: number;
  paging: Paging;
}

export const initialState: DashboardState = {
  activeTab: 'assigned-to-me',
  items: [],
  total: 0,
  paging: {
    page: 1,
    pageSize: 10,
  },
};
