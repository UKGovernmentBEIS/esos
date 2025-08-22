import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';

import { ButtonDirective } from 'govuk-components';

import { RequestCreateActionProcessDTO } from 'esos-api';

import { ProcessActionsService } from '../process-actions.service';
import { processActionsDetailsTypesMap } from '../process-actions-map';

@Component({
  selector: 'esos-disaggregated-start',
  standalone: true,
  imports: [PageHeadingComponent, PendingButtonDirective, ButtonDirective, AsyncPipe],
  templateUrl: './disaggregated-start.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisaggregatedStartComponent {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly processActionsService = inject(ProcessActionsService);

  accountId: string = this.router.getCurrentNavigation()?.extras?.state?.accountId;
  requestType: RequestCreateActionProcessDTO['requestCreateActionType'] =
    this.router.getCurrentNavigation()?.extras?.state?.requestType;

  constructor() {
    if (this.accountId === undefined || !this.requestType) {
      this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    }
  }

  getRequestTypeString(requestType): string {
    return processActionsDetailsTypesMap[requestType];
  }

  onRequestButtonClick() {
    this.processActionsService.processRequestCreateAction({
      requestType: this.requestType,
      accountId: +this.accountId,
      isDisaggregateUndertaking: true,
    });
  }
}
