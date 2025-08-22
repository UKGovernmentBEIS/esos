import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { ProgressUpdateGroupChangeSummaryPageComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PU_GROUP_CHANGE_SUBTASK_TITLE } from '@tasks/progress-update-common/pu-group-change';
import { progressUpdate1ApplicationTimelineQuery } from '@timeline/progress-update-1/+state/pu1-application.selectors';

@Component({
  selector: 'esos-pu1-group-change',
  standalone: true,
  imports: [PageHeadingComponent, ProgressUpdateGroupChangeSummaryPageComponent],
  templateUrl: './pu1-group-change.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Pu1GroupChangeComponent {
  readonly data = this.store.select(progressUpdate1ApplicationTimelineQuery.selectGroupChange);
  readonly title = PU_GROUP_CHANGE_SUBTASK_TITLE;

  constructor(private readonly store: RequestActionStore) {}
}
