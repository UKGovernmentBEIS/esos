import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { ProgressUpdateResponsibleOfficerConfirmationComponent } from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE } from '@tasks/progress-update-common/pu-responsible-officer-confirmation';
import { progressUpdate2ApplicationTimelineQuery } from '@timeline/progress-update-2/+state/pu2-application.selectors';

@Component({
  selector: 'esos-pu2-responsible-officer-confirmation',
  standalone: true,
  imports: [PageHeadingComponent, ProgressUpdateResponsibleOfficerConfirmationComponent],
  templateUrl: './pu2-responsible-officer-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Pu2ResponsibleOfficerConfirmationComponent {
  data = this.store.select(progressUpdate2ApplicationTimelineQuery.selectResponsibleOfficerConfirmation)();
  readonly title = PU_RESPONSIBLE_OFFICER_CONFIRMATION_SUBTASK_TITLE;

  constructor(private readonly store: RequestActionStore) {}
}
