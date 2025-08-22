import { NgComponentOutlet, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, Inject, Injector, Signal, Type } from '@angular/core';

import {
  reportableRequestActionTypes,
  reportComponentRequestActionTypes,
} from '@common/request-action/request-action.util';
import { TaskListComponent } from '@common/shared/components/task-list';
import { TaskSection } from '@common/shared/model';
import { RelatedReportsComponent } from '@shared/components/related-reports/related-reports.component';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';

import { requestActionQuery, RequestActionStore } from '../../+state';
import { REQUEST_ACTION_PAGE_CONTENT } from '../../request-action.providers';
import { RequestActionPageContentFactoryMap } from '../../request-action.types';

type ViewModel = {
  header: string;
  headerDate: string;
  sections: TaskSection[];
  component: Type<unknown>;
  hasReport: boolean;
  dataComponent: Type<unknown>;
};

@Component({
  selector: 'esos-request-action-page',
  standalone: true,
  imports: [
    NgIf,
    NgComponentOutlet,
    PageHeadingComponent,
    TaskListComponent,
    GovukDatePipe,
    RelatedReportsComponent,
  ],
  templateUrl: './request-action-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestActionPageComponent {
  vm: Signal<ViewModel> = computed(() => {
    const requestAction = this.store.select(requestActionQuery.selectAction)();

    if (!requestAction) {
      return null;
    }

    const { header, headerDate, sections, component } = this.contentFactoryMap[requestAction.type](this.injector);

    const hasReport = reportableRequestActionTypes.includes(requestAction?.type);

    const dataComponent = reportComponentRequestActionTypes.find((entry) =>
      entry.requestActionTypes.includes(requestAction?.type),
    )?.reportComponent;

    return {
      header,
      headerDate: headerDate ?? requestAction.creationDate,
      sections,
      component,
      hasReport,
      dataComponent,
    };
  });

  constructor(
    @Inject(REQUEST_ACTION_PAGE_CONTENT) private readonly contentFactoryMap: RequestActionPageContentFactoryMap,
    private readonly store: RequestActionStore,
    private readonly injector: Injector,
  ) {}
}
