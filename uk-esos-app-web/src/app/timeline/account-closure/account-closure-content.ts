import { requestActionQuery, RequestActionStore } from '@common/request-action/+state';
import { RequestActionPageContentFactory } from '@common/request-action/request-action.types';
import { ItemActionHeaderPipe } from '@shared/pipes/item-action-header.pipe';

import { accountClosureApplicationTimelineQuery } from './+state/account-closure-application-submitted.selectors';
import { AccountClosureApplicationSubmittedComponent } from './account-closure-application-submitted/account-closure-application-submitted.component';

export const accountClosureContent: RequestActionPageContentFactory = (injector) => {
  const pipe = new ItemActionHeaderPipe();
  const action = injector.get(RequestActionStore).select(requestActionQuery.selectAction)();

  const submissionDate = injector
    .get(RequestActionStore)
    .select(accountClosureApplicationTimelineQuery.selectSubmissionDate)();

  return {
    header: pipe.transform(action),
    headerDate: submissionDate,
    component: AccountClosureApplicationSubmittedComponent,
  };
};
