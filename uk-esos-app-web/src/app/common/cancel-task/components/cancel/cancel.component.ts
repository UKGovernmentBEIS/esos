import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CancelTaskService } from '@common/cancel-task/cancel-task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { BreadcrumbService } from '@shared/breadcrumbs/breadcrumb.service';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';

import { GovukComponentsModule } from 'govuk-components';

import { cancelActionMap } from '../../cancel-action.map';

@Component({
  selector: 'esos-cancel-task',
  standalone: true,
  template: `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <esos-page-heading size="l" [bottomSpacing]="8">Are you sure you want to cancel this task?</esos-page-heading>
        <p class="govuk-body govuk-!-margin-bottom-7">This task and its data will be deleted.</p>
        <div class="govuk-button-group">
          <button type="submit" esosPendingButton (click)="onCancel()" govukWarnButton>Yes, cancel this task</button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GovukComponentsModule, PendingButtonDirective, PageHeadingComponent],
})
export class CancelComponent implements OnInit {
  private readonly requestTaskType = this.store.select(requestTaskQuery.selectRequestTaskType);
  private readonly allowedRequestTaskActions = this.store.select(requestTaskQuery.selectAllowedRequestTaskActions);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly breadcrumbService: BreadcrumbService,
    private readonly store: RequestTaskStore,
    private readonly cancelTaskService: CancelTaskService,
  ) {}

  ngOnInit() {
    this.resolveBreadcrumb();

    // check if cancel action is available for given request type
    const requestTaskActionType = cancelActionMap[this.requestTaskType()];
    if (!requestTaskActionType || !this.allowedRequestTaskActions().includes(requestTaskActionType)) {
      this.router.navigate(['error', '404']);
    }
  }

  onCancel(): void {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const requestTaskActionType = cancelActionMap[this.requestTaskType()];

    this.cancelTaskService
      .cancel({ requestTaskId, requestTaskActionType })
      .subscribe(() => this.router.navigate(['confirmation'], { relativeTo: this.route }));
  }

  private resolveBreadcrumb(): void {
    const breadcrumbs = this.breadcrumbService.breadcrumbItem$.getValue();
    const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
    const parentRoute = this.route.routeConfig.path === '' ? this.route.parent.parent : this.route.parent;
    const parentRouteEndsWithTaskId = parentRoute.routeConfig.path.endsWith(':taskId');

    if (/\d+$/.test(lastBreadcrumb.link.join('/')) && !parentRouteEndsWithTaskId) {
      const parentRoutePath = parentRoute.routeConfig.path;
      lastBreadcrumb.link = [...lastBreadcrumb.link, parentRoutePath];
      this.breadcrumbService.show([...breadcrumbs.slice(0, breadcrumbs.length - 1), lastBreadcrumb]);
    }
  }
}
