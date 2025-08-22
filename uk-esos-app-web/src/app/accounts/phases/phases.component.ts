import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  first,
  map,
  Observable,
  shareReplay,
  switchMap,
} from 'rxjs';

import { workflowDetailsTypesMap } from '@accounts/shared/workflowDetailsTypesMap';
import { StatusTagColorPipe } from '@common/request-task/pipes/status-tag-color';
import { AccountType } from '@core/store/auth';
import { PhasesPipe } from '@shared/pipes/phases.pipe';
import { SharedModule } from '@shared/shared.module';

import { RequestDetailsDTO, RequestSearchByAccountCriteria, RequestsService } from 'esos-api';

import { AccountsStore } from '..';
import { phasesStatusesMap, phasesStatusesTagMap, phasesTypesMap } from './phasesMap';

interface Report {
  phase: string;
  reportsDetails: RequestDetailsDTO[];
}

@Component({
  selector: 'esos-phases',
  templateUrl: './phases.component.html',
  standalone: true,
  imports: [PhasesPipe, RouterLink, SharedModule, StatusTagColorPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhasesComponent implements OnInit {
  reportsTypesTagsMap = workflowDetailsTypesMap;
  reportsStatusesTagMap = phasesStatusesTagMap;

  readonly pageSize = 5;
  page$ = new BehaviorSubject<number>(1);
  showPagination$ = new BehaviorSubject<boolean>(true);
  totalReportsNumber$ = new BehaviorSubject<number>(0);

  reportTypesPerDomain: Record<string, string[]>;
  reportStatusesPerDomain: Record<string, string>;
  domain: AccountType;
  accountId$: Observable<number>;
  report$: Observable<Report[]>;
  allReports$: Observable<Report[]>;

  private searchTypes$ = new BehaviorSubject<RequestDetailsDTO['requestType'][]>([]);
  private searchStatuses$ = new BehaviorSubject<RequestSearchByAccountCriteria['requestStatuses'][]>([]);

  constructor(private readonly accountsStore: AccountsStore, private readonly requestsService: RequestsService) {}

  ngOnInit(): void {
    this.accountId$ = this.accountsStore.pipe(
      first(),
      map((accounts) => accounts.selectedAccount.id),
    );

    this.reportTypesPerDomain = phasesTypesMap[this.domain];

    this.reportStatusesPerDomain = phasesStatusesMap[this.domain];

    this.allReports$ = combineLatest([this.accountId$, this.searchTypes$, this.searchStatuses$]).pipe(
      switchMap(([accountId, types, statuses]) =>
        this.requestsService.getRequestDetailsByAccountId({
          accountId: accountId,
          category: 'REPORTING',
          requestTypes: types.reduce((acc, val) => acc.concat(val), []),
          requestStatuses: statuses.reduce((acc, val) => acc.concat(val), []),
          pageNumber: 0,
          pageSize: 999999,
        }),
      ),
      map((results) => {
        const totalReports = this.buildTotalReportsData(results.requestDetails);

        this.totalReportsNumber$.next(totalReports.length);
        this.showPagination$.next(totalReports.length > this.pageSize);

        return totalReports;
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.report$ = combineLatest([this.allReports$, this.page$.pipe(distinctUntilChanged())]).pipe(
      map(([totalReports, page]) => this.getCurrentPageReports(totalReports, page - 1, this.pageSize)),
    );
  }

  private getCurrentPageReports(reports: Report[], page: number, pageSize: number): Report[] {
    return reports.slice(page * pageSize, (page + 1) * pageSize);
  }

  private buildTotalReportsData(reports: RequestDetailsDTO[]): Report[] {
    const reportsDetailsByCategory = reports.reduce((acc, val) => {
      const phase = (val.requestMetadata as any).phase as string;
      const categoryReportsDetails = acc[phase] || [];

      return {
        ...acc,
        [phase]: [...categoryReportsDetails, val],
      };
    }, {});

    return (
      (reportsDetailsByCategory &&
        Object.keys(reportsDetailsByCategory)
          .map((phase) => ({
            phase,
            reportsDetails: reportsDetailsByCategory[phase].sort(
              (a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime(),
            ),
          }))
          .sort((a, b) => Number(b.phase) - Number(a.phase))) ??
      []
    );
  }
}
