import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PendingRequestService } from '@core/guards/pending-request.service';
import { EsosAccount } from '@core/store';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';

import { ButtonDirective } from 'govuk-components';

import { MiReportsService } from 'esos-api';

import { miReportTypeDescriptionMap } from '../core/mi-report';
import { ProgressUpdate1PublishedDataResult } from './pu1-published-data.interfaces';
import { ProgressUpdate1PublishedDataService } from './pu1-published-data.service';

@Component({
  selector: 'esos-pu1-published-data',
  standalone: true,
  imports: [ButtonDirective, PageHeadingComponent, PendingButtonDirective],
  template: `
    <esos-page-heading>{{ header }}</esos-page-heading>
    <button esosPendingButton govukButton type="button" (click)="exportToExcel()">Export to excel</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressUpdate1PublishedDataComponent {
  header = miReportTypeDescriptionMap['PROGRESS_UPDATE_1_SUBMITTED_DATA_P3'];

  constructor(
    private readonly miReportsService: MiReportsService,
    private readonly progressUpdate1PublishedDataService: ProgressUpdate1PublishedDataService,
    private readonly pendingRequestService: PendingRequestService,
  ) {}

  exportToExcel() {
    this.miReportsService
      .generateReport(EsosAccount, { reportType: 'PROGRESS_UPDATE_1_SUBMITTED_DATA_P3' })
      .pipe(this.pendingRequestService.trackRequest())
      .subscribe((result: any) =>
        this.progressUpdate1PublishedDataService.exportToExcel(result as ProgressUpdate1PublishedDataResult),
      );
  }
}
