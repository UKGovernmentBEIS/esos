import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  createRequestCreateActionProcessDTO,
  reinitiateTaskMap,
} from '@accounts/shared/workflow-item/workflow-related-create-actions/workflowCreateAction';
import { PendingRequestService } from '@core/guards/pending-request.service';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { CapitalizeFirstPipe } from '@shared/pipes/capitalize-first.pipe';

import { ButtonDirective, LinkDirective, PanelComponent } from 'govuk-components';

import { RequestsService } from 'esos-api';

@Component({
  selector: 'esos-reinitiate-task',
  standalone: true,
  imports: [
    PageHeadingComponent,
    RouterLink,
    LinkDirective,
    PendingButtonDirective,
    ButtonDirective,
    PanelComponent,
    CapitalizeFirstPipe,
  ],
  templateUrl: './reinitiate-task.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReinitiateTaskComponent {
  readonly isReinitiated = signal(false);
  private readonly accountId = Number(this.route.snapshot.paramMap.get('accountId'));
  private readonly requestId = this.route.snapshot.paramMap.get('request-id');
  private readonly taskType = this.route.snapshot.paramMap.get('taskType');
  private readonly taskMap = reinitiateTaskMap.find((item) => item.taskTypePath === this.taskType);
  readonly taskLabel = this.taskMap?.label ?? 'task';

  constructor(
    readonly pendingRequest: PendingRequestService,
    private readonly requestsService: RequestsService,
    private readonly route: ActivatedRoute,
  ) {}

  onReinitiate(): void {
    this.requestsService
      .processRequestCreateAction(
        createRequestCreateActionProcessDTO(this.taskMap.requestCreateActionType, this.requestId),
        this.accountId,
      )
      .pipe(this.pendingRequest.trackRequest())
      .subscribe(() => this.isReinitiated.update(() => true));
  }
}
