import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, combineLatest, map, Observable, shareReplay, Subject, switchMap, tap } from 'rxjs';

import { DestroySubject } from '@core/services/destroy-subject.service';
import { EsosAccount } from '@core/store/auth';
import { AccountStatusPipe } from '@shared/pipes/account-status.pipe';
import { AccountTypePipe } from '@shared/pipes/account-type.pipe';

import { GovukTableColumn } from 'govuk-components';

import { AccountsUsersContactsMiReportResult, AccountUserContact, MiReportsService } from 'esos-api';

import { ExtendedMiReportResult } from '../core/mi-interfaces';
import { createTableColumns, createTablePage, pageSize } from '../core/mi-report';
import { MiReportsExportService } from '../core/mi-reports-export.service';
import { AuthorityStatusPipe } from '../pipes/authority-status.pipe';

@Component({
  selector: 'esos-accounts-users-contacts',
  template: `
    <esos-page-heading size="xl">List of Accounts, Users and Contacts</esos-page-heading>
    <div class="govuk-button-group">
      <button esosPendingButton govukButton type="button" (click)="generateReport()">Execute</button>
      <button esosPendingButton govukButton type="button" (click)="exportToExcel()">Export to excel</button>
    </div>

    <div *ngIf="pageItems$ | async as items">
      <ng-container *ngIf="items.length">
        <div class="overflow-auto overflow-auto-table">
          <govuk-table [columns]="tableColumns" [data]="items"></govuk-table>
        </div>

        <govuk-pagination
          [count]="totalNumOfItems$ | async"
          (currentPageChange)="currentPage$.next($event)"
          [pageSize]="pageSize"
        ></govuk-pagination>
      </ng-container>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroySubject],
})
export class AccountsUsersContactsComponent implements OnInit {
  readonly pageSize = pageSize;

  accountsUsersContacts$ = this.miReportsService
    .generateReport(EsosAccount, { reportType: 'LIST_OF_ACCOUNTS_USERS_CONTACTS' })
    .pipe(
      map((miReportResult: AccountsUsersContactsMiReportResult) => ({
        ...miReportResult,
        results: this.addPipesToResult(miReportResult.results),
      })),
    );
  reportItems$: Observable<AccountUserContact[]>;
  pageItems$: Observable<AccountUserContact[]>;
  totalNumOfItems$: Observable<number>;

  currentPage$ = new BehaviorSubject<number>(1);
  generateReport$ = new Subject<void>();
  tableColumns: GovukTableColumn<AccountUserContact>[];

  constructor(
    private readonly miReportsService: MiReportsService,
    private readonly miReportsExportService: MiReportsExportService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.reportItems$ = this.generateReport$.pipe(
      switchMap(() => this.accountsUsersContacts$),
      tap(
        (miReportResult: AccountsUsersContactsMiReportResult) =>
          (this.tableColumns = createTableColumns(miReportResult.columnNames)),
      ),
      map((miReportResult) => miReportResult.results),
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

  addPipesToResult(results: AccountsUsersContactsMiReportResult['results']) {
    return results.map((accountUserContact) => {
      const accountTypePipe = new AccountTypePipe();
      const accountStatusPipe = new AccountStatusPipe();
      const authorityStatusPipe = new AuthorityStatusPipe();

      return {
        ...accountUserContact,
        'Account type': accountTypePipe.transform(accountUserContact['Account type']),
        'Account status': accountStatusPipe.transform(accountUserContact['Account status']),
        'User status': authorityStatusPipe.transform(accountUserContact['User status']),
      };
    });
  }

  exportToExcel() {
    this.accountsUsersContacts$
      .pipe(
        map((miReportResult: ExtendedMiReportResult) =>
          this.miReportsExportService.manipulateResultsAndExportToExcel(miReportResult, 'Accounts, Users and Contacts'),
        ),
      )
      .subscribe();
  }
}
