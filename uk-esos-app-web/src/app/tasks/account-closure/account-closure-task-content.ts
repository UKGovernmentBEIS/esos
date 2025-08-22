import { RequestTaskPageContentFactory } from '@common/request-task/request-task.types';

import { AccountClosureFormComponent } from './components/account-closure-form/account-closure-form.component';

export const accountClosureTaskContent: RequestTaskPageContentFactory = () => {
  return {
    header: 'Close account',
    warningMessage: 'If you close the account all active tasks and workflows will be terminated.',
    contentComponent: AccountClosureFormComponent,
  };
};
