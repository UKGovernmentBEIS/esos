import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EMPTY, expand, map, Observable, reduce } from 'rxjs';

import { PendingRequestService } from '@core/guards/pending-request.service';
import { EsosAccount } from '@core/store';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';

import { ButtonDirective } from 'govuk-components';

import { NOCReportsService } from 'esos-api';

import { miReportTypeDescriptionMap } from '../core/mi-report';
import { manipulateNocsAndExportToExcel } from './submitted-nocs.helper';
import { NocReportResult } from './submitted-nocs.interfaces';

@Component({
  selector: 'esos-submitted-nocs',
  standalone: true,
  imports: [ButtonDirective, PageHeadingComponent, PendingButtonDirective],
  template: `
    <esos-page-heading>{{ header }}</esos-page-heading>

    <button esosPendingButton govukButton type="button" (click)="exportToExcel()">Export to excel</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmittedNocsComponent {
  header = miReportTypeDescriptionMap['NOC_SUBMITTED_DATA_P3'];
  private sizePerCall = 1000;

  constructor(
    private readonly nocReportsService: NOCReportsService,
    readonly pendingRequestService: PendingRequestService,
  ) {}

  getSubmittedNocs(page: number): Observable<NocReportResult> {
    return this.nocReportsService.generateNocP3Report(EsosAccount, page, this.sizePerCall).pipe(
      map((data) => ({
        nocs: Object.values(data.results),
        total: data.total,
      })),
    );
  }

  exportToExcel() {
    let nocsCounter = 0;
    let page = 0;

    this.getSubmittedNocs(page)
      .pipe(
        expand((res) => {
          nocsCounter += Object.keys(res.nocs).length;

          return nocsCounter < res.total ? this.getSubmittedNocs(++page) : EMPTY;
        }),
        reduce(
          (acc, curr) => {
            return { nocs: [...acc.nocs, ...curr.nocs], total: curr.total };
          },
          {
            total: 0,
            nocs: [],
          },
        ),
        this.pendingRequestService.trackRequest(),
      )
      .subscribe((res) => {
        if (res.total > 0) {
          manipulateNocsAndExportToExcel(res);
        }
      });
  }
}
