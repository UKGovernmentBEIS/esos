import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PendingRequestService } from '@core/guards/pending-request.service';
import { EsosAccount } from '@core/store';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';

import { ButtonDirective } from 'govuk-components';

import { MiReportsService } from 'esos-api';

import { miReportTypeDescriptionMap } from '../core/mi-report';
import { ActionPlanPublishedDataResult } from './action-plan-published-data.interfaces';
import { ActionPlanPublishedDataService } from './action-plan-published-data.service';

@Component({
  selector: 'esos-action-plan-published-data',
  standalone: true,
  imports: [ButtonDirective, PageHeadingComponent, PendingButtonDirective],
  template: `
    <esos-page-heading>{{ header }}</esos-page-heading>
    <button esosPendingButton govukButton type="button" (click)="exportToExcel()">Export to excel</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionPlanPublishedDataComponent {
  header = miReportTypeDescriptionMap['ACTION_PLAN_SUBMITTED_DATA_P3'];

  constructor(
    private readonly miReportsService: MiReportsService,
    private readonly actionPlanPublishedDataService: ActionPlanPublishedDataService,
    private readonly pendingRequestService: PendingRequestService,
  ) {}

  exportToExcel() {
    this.miReportsService
      .generateReport(EsosAccount, { reportType: 'ACTION_PLAN_SUBMITTED_DATA_P3' })
      .pipe(this.pendingRequestService.trackRequest())
      .subscribe((result: any) =>
        this.actionPlanPublishedDataService.exportToExcel(result as ActionPlanPublishedDataResult),
      );
  }
}
