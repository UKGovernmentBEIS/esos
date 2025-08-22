import { ChangeDetectionStrategy, Component } from '@angular/core';

import { requestActionQuery, RequestActionStore } from '@common/request-action/+state';
import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';
import { SummaryHeaderComponent } from '@shared/summary-header/summary-header.component';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from 'govuk-components';

import { accountClosureApplicationTimelineQuery } from '../+state/account-closure-application-submitted.selectors';

@Component({
  selector: 'esos-account-closure-application-submitted',
  standalone: true,
  imports: [
    GovukDatePipe,
    SummaryHeaderComponent,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
  ],
  templateUrl: './account-closure-application-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountClosureApplicationSubmittedComponent {
  reason = this.store.select(accountClosureApplicationTimelineQuery.selectReason);
  submitter = this.store.select(requestActionQuery.selectSubmitter);
  submissionDate = this.store.select(accountClosureApplicationTimelineQuery.selectSubmissionDate);

  constructor(private readonly store: RequestActionStore) {}
}
