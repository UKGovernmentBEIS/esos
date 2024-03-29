import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs';

import { PaymentStore } from '../../store/payment.store';

@Component({
  selector: 'esos-not-success',
  template: `
    <esos-page-heading>{{ message$ | async }}</esos-page-heading>
    <esos-return-link [requestType]="(store | async).requestType" [home]="true"></esos-return-link>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotSuccessComponent {
  message$ = this.route.queryParams.pipe(map((params) => params?.message));

  constructor(readonly store: PaymentStore, private readonly route: ActivatedRoute) {}
}
