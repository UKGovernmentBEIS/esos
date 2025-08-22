import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  Inject,
  Injector,
  Signal,
  Type,
  ViewEncapsulation,
} from '@angular/core';

import { RelatedActionsComponent } from '@shared/components/related-actions/related-actions.component';
import { RelatedTasksComponent } from '@shared/components/related-tasks/related-tasks.component';
import { TaskHeaderInfoComponent } from '@shared/components/task-header-info/task-header-info.component';
import { TimelineComponent } from '@shared/components/timeline/timeline.component';
import { TimelineItemComponent } from '@shared/components/timeline/timeline-item.component';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { TimelineItemLinkPipe } from '@shared/pipes/timeline-item-link.pipe';

import { WarningTextComponent } from 'govuk-components';

import { ItemDTO, RequestActionInfoDTO, RequestTaskDTO, RequestTaskItemDTO } from 'esos-api';

import { TaskListComponent } from '../../../shared/components/task-list';
import { TaskSection } from '../../../shared/model';
import { requestTaskQuery, RequestTaskStore } from '../../+state';
import { REQUEST_TASK_PAGE_CONTENT } from '../../request-task.providers';
import { RequestTaskPageContentFactoryMap } from '../../request-task.types';

type ViewModel = {
  requestTask: RequestTaskDTO;
  header: string;
  sections: TaskSection[] | null;
  contentComponent: Type<unknown> | null;
  preContentComponent: Type<unknown> | null;
  postContentComponent: Type<unknown> | null;
  relatedTasks: ItemDTO[];
  hasRelatedTasks: boolean;
  timeline: RequestActionInfoDTO[];
  hasTimeline: boolean;
  isAssignable: boolean;
  relatedActions: RequestTaskItemDTO['allowedRequestTaskActions'];
  hasRelatedActions: boolean;
  warningMessage?: string;
};

/* eslint-disable @angular-eslint/use-component-view-encapsulation */
@Component({
  selector: 'esos-request-task-page',
  templateUrl: './request-task-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    PageHeadingComponent,
    TaskHeaderInfoComponent,
    NgComponentOutlet,
    RelatedTasksComponent,
    TimelineComponent,
    TimelineItemComponent,
    TimelineItemLinkPipe,
    RelatedActionsComponent,
    TaskListComponent,
    WarningTextComponent,
  ],
})
export class RequestTaskPageComponent {
  vm: Signal<ViewModel> = computed(() => {
    const requestTask = this.store.select(requestTaskQuery.selectRequestTask)();
    if (!requestTask) {
      return null;
    }

    const relatedTasks = this.store.select(requestTaskQuery.selectRelatedTasks)();
    const timeline = this.store.select(requestTaskQuery.selectTimeline)();
    const isAssignable = this.store.select(requestTaskQuery.selectUserAssignCapable)();
    const relatedActions = this.store.select(requestTaskQuery.selectRelatedActions)();
    const { header, warningMessage, sections, contentComponent, preContentComponent, postContentComponent } =
      this.contentFactoryMap[requestTask.type](this.injector);

    return {
      requestTask,
      header,
      warningMessage,
      sections,
      contentComponent,
      preContentComponent,
      postContentComponent,
      relatedTasks,
      timeline,
      relatedActions,
      isAssignable,
      hasRelatedTasks: relatedTasks?.length > 0,
      hasTimeline: timeline?.length > 0,
      hasRelatedActions: relatedActions?.length > 0 || isAssignable,
    };
  });

  constructor(
    private readonly store: RequestTaskStore,
    @Inject(REQUEST_TASK_PAGE_CONTENT)
    private readonly contentFactoryMap: RequestTaskPageContentFactoryMap,
    private readonly injector: Injector,
  ) {
    effect(() => {
      if (!!this.vm() && !this.vm().contentComponent && !this.vm().sections) {
        throw new Error(
          'You need to provide either a content component or the sections for the request task page to work',
        );
      }
    });
  }
}
