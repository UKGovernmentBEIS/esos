import { ChangeDetectionStrategy, Component } from '@angular/core';

import { first, map, Observable } from 'rxjs';

import { PaymentCancelledRequestActionPayload } from 'esos-api';

import { PaymentStore } from '../../store/payment.store';

@Component({
  selector: 'esos-cancelled',
  template: `
    <ng-container *ngIf="details$ | async as details">
      <esos-request-action-heading headerText="Payment task cancelled" [timelineCreationDate]="creationDate$ | async">
      </esos-request-action-heading>
      <h2 esos-summary-header class="govuk-heading-m">Details</h2>
      <dl govuk-summary-list>
        <div govukSummaryListRow>
          <dt govukSummaryListRowKey>Payment status</dt>
          <dd govukSummaryListRowValue>{{ details.status | paymentStatus }}</dd>
        </div>
        <div govukSummaryListRow>
          <dt govukSummaryListRowKey>Reason</dt>
          <dd govukSummaryListRowValue class="pre-wrap">{{ details.cancellationReason }}</dd>
        </div>
      </dl>
    </ng-container>
    <esos-return-link [requestType]="(store | async).requestType" [home]="true"></esos-return-link>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelledComponent {
  details$ = this.store.pipe(
    first(),
    map((state) => state.actionPayload as PaymentCancelledRequestActionPayload),
  );
  creationDate$: Observable<string> = this.store.select('requestActionCreationDate');

  constructor(readonly store: PaymentStore) {}
}
