import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, combineLatest, map, Observable, shareReplay, Subject, switchMap, tap } from 'rxjs';

import { DestroySubject } from '@core/services/destroy-subject.service';
import { EsosAccount } from '@core/store/auth';
import { AccountStatusPipe } from '@shared/pipes/account-status.pipe';
import { AccountTypePipe } from '@shared/pipes/account-type.pipe';

import { GovukTableColumn } from 'govuk-components';

import { AccountAssignedRegulatorSiteContactsMiReportResult, MiReportsService } from 'esos-api';

import { ExtendedMiReportResult } from '../core/mi-interfaces';
import { createTableColumns, createTablePage, manipulateResultsAndExportToExcel, pageSize } from '../core/mi-report';

@Component({
  selector: 'esos-accounts-regulators-site-contacts',
  template: `
    <esos-page-heading size="xl">List of Accounts, Assigned Regulators and Site Contacts</esos-page-heading>
    <div class="govuk-button-group">
      <button esosPendingButton govukButton type="button" (click)="generateReport()">Execute</button>
      <button esosPendingButton govukButton type="button" (click)="exportToExcel()">Export to excel</button>
    </div>
    <div *ngIf="pageItems$ | async as items">
      <ng-container *ngIf="items.length; else noResults">
        <div class="overflow-auto overflow-auto-table">
          <govuk-table [columns]="tableColumns" [data]="items"></govuk-table>
        </div>
        <esos-pagination
          [count]="totalNumOfItems$ | async"
          (currentPageChange)="currentPage$.next($event)"
          [pageSize]="pageSize"
        ></esos-pagination>
      </ng-container>
      <ng-template #noResults>
        <div class="govuk-body"><h2>No results</h2></div>
      </ng-template>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroySubject],
})
export class AccountsRegulatorsSiteContactsComponent implements OnInit {
  readonly pageSize = pageSize;

  accountsRegulatorsSiteContacts$ = this.miReportsService
    .generateReport(EsosAccount, {
      reportType: 'LIST_OF_ACCOUNTS_ASSIGNED_REGULATOR_SITE_CONTACTS',
    })
    .pipe(
      map((miReportResult: AccountAssignedRegulatorSiteContactsMiReportResult) => ({
        ...miReportResult,
        results: this.addPipesToResult(miReportResult.results),
      })),
    );

  reportItems$: Observable<any[]>;
  pageItems$: Observable<any[]>;
  totalNumOfItems$: Observable<number>;

  currentPage$ = new BehaviorSubject<number>(1);
  generateReport$ = new Subject<void>();

  tableColumns: GovukTableColumn[];

  constructor(
    private readonly miReportsService: MiReportsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.reportItems$ = this.generateReport$.pipe(
      switchMap(() => this.accountsRegulatorsSiteContacts$),
      tap((miReportResult) => (this.tableColumns = createTableColumns(miReportResult.columnNames))),
      map((miReportResult) => this.sortResults(miReportResult.results)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.pageItems$ = combineLatest([this.reportItems$, this.currentPage$]).pipe(
      map(([items, currentPage]) => createTablePage(currentPage, this.pageSize, items)),
    );

    this.totalNumOfItems$ = this.reportItems$.pipe(map((items) => items.length));
  }

  generateReport() {
    this.generateReport$.next();
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: 1 }, queryParamsHandling: 'merge' });
  }

  exportToExcel() {
    this.accountsRegulatorsSiteContacts$
      .pipe(
        map((miReportResult: ExtendedMiReportResult) =>
          manipulateResultsAndExportToExcel(
            miReportResult,
            'Accounts, Assigned Regulators and Site Contacts',
            this.sortResults,
          ),
        ),
      )
      .subscribe();
  }

  sortResults(
    results: {
      [x: string]: any;
    }[],
  ) {
    return results.sort(
      (a, b) =>
        (a['Assigned regulator'] ? a['Assigned regulator'] : '')?.localeCompare(b['Assigned regulator']) ||
        a['Account status'].localeCompare(b['Account status']) ||
        a['Legal Entity name'].localeCompare(b['Legal Entity name']) ||
        a['Account name'].localeCompare(b['Account name']),
    );
  }

  addPipesToResult(results: AccountAssignedRegulatorSiteContactsMiReportResult['results']) {
    return results.map((accountAssignedRegulatorSiteContact) => {
      const accountTypePipe = new AccountTypePipe();
      const accountStatusPipe = new AccountStatusPipe();

      return {
        ...accountAssignedRegulatorSiteContact,
        'Account type': accountTypePipe.transform(accountAssignedRegulatorSiteContact['Account type']),
        'Account status': accountStatusPipe.transform(accountAssignedRegulatorSiteContact['Account status']),
      };
    });
  }
}
