import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, combineLatest, map, shareReplay, switchMap } from 'rxjs';

import { StatusTagColorPipe } from '@common/request-task/pipes/status-tag-color';
import { DestroySubject } from '@core/services/destroy-subject.service';
import { AuthStore } from '@core/store/auth';
import { RelatedTasksComponent } from '@shared/components/related-tasks/related-tasks.component';
import { TimelineComponent } from '@shared/components/timeline/timeline.component';
import { TimelineItemComponent } from '@shared/components/timeline/timeline-item.component';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { TimelineItemLinkPipe } from '@shared/pipes/timeline-item-link.pipe';
import { SharedModule } from '@shared/shared.module';

import {
  RequestActionInfoDTO,
  RequestActionsService,
  RequestCreateActionProcessDTO,
  RequestItemsService,
  RequestsService,
} from 'esos-api';

import { statusesTagMap } from '../statusesTagMap';
import { workflowDetailsTypesMap } from '../workflowDetailsTypesMap';
import { RequestNotesComponent } from './notes/request-notes.component';
import { WorkflowItemAbstractComponent } from './workflow-item-abstract.component';
import { WorkflowRelatedCreateActionsComponent } from './workflow-related-create-actions/workflow-related-create-actions.component';

@Component({
  selector: 'esos-workflow-item',
  templateUrl: './workflow-item.component.html',
  standalone: true,
  imports: [
    PageHeadingComponent,
    RelatedTasksComponent,
    RequestNotesComponent,
    SharedModule,
    StatusTagColorPipe,
    TimelineComponent,
    TimelineItemComponent,
    TimelineItemLinkPipe,
    WorkflowRelatedCreateActionsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroySubject],
})
export class WorkflowItemComponent extends WorkflowItemAbstractComponent {
  currentTab$ = new BehaviorSubject<string>(null);

  navigationState = { returnUrl: this.router.url };
  readonly workflowStatusesTagMap = statusesTagMap;
  readonly workflowDetailsTypesMap = workflowDetailsTypesMap;

  readonly requestInfo$ = this.requestId$.pipe(
    switchMap((requestId) => this.requestsService.getRequestDetailsById(requestId)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly title$ = this.requestInfo$.pipe(map((requestInfo) => (requestInfo.requestMetadata as any)?.year ?? ''));

  readonly relatedTasks$ = this.requestId$.pipe(
    switchMap((requestId) => this.requestItemsService.getItemsByRequest(requestId)),
    map((items) => items.items),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly actions$ = this.requestId$.pipe(
    switchMap((requestId) => this.requestActionsService.getRequestActionsByRequestId(requestId)),
    map((res) => this.sortTimeline(res)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  validRequestCreateActionsTypes$ = combineLatest([this.accountId$, this.requestInfo$]).pipe(
    switchMap(([accountId, requestInfo]) => {
      switch (requestInfo.requestType) {
        case 'NOTIFICATION_OF_COMPLIANCE_P3':
        case 'ACTION_PLAN_P3':
        case 'PROGRESS_UPDATE_1_P3':
        case 'PROGRESS_UPDATE_2_P3':
          return this.requestsService.getAvailableRequestWorkflows(requestInfo.id);
        default:
          return this.requestsService.getAvailableAccountWorkflows(accountId);
      }
    }),
    map((availableCreateActions) =>
      (Object.keys(availableCreateActions) as RequestCreateActionProcessDTO['requestCreateActionType'][]).filter(
        (createActionType) => availableCreateActions[createActionType].valid,
      ),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  constructor(
    public readonly router: Router,
    protected readonly authStore: AuthStore,
    protected readonly route: ActivatedRoute,
    private readonly requestsService: RequestsService,
    private readonly requestItemsService: RequestItemsService,
    private readonly requestActionsService: RequestActionsService,
  ) {
    super(router, route);
  }

  private sortTimeline(res: RequestActionInfoDTO[]): RequestActionInfoDTO[] {
    return res.slice().sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
  }

  selectedTab(selected: string) {
    // upon pagination queryParams is shown, for example "?page=3". In order to avoid any bug from navigation to tabs, clear query params.
    this.router.navigate([], {
      relativeTo: this.route,
      preserveFragment: true,
    });
    this.currentTab$.next(selected);
  }
}
