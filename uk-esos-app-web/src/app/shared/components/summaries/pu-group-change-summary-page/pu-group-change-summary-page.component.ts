import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PU_GROUP_CHANGE_FORM_CONTENT } from '@tasks/progress-update-common/pu-group-change/group-change-form/group-change-form-content';
import { ProgressUpdateGroupChangeStepUrl } from '@tasks/progress-update-common/pu-group-change/pu-group-change.helper';

import { GovukComponentsModule } from 'govuk-components';

import { GroupChange } from 'esos-api';

@Component({
  selector: 'esos-pu-group-change-summary-page',
  standalone: true,
  imports: [GovukComponentsModule, RouterLink],
  templateUrl: './pu-group-change-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressUpdateGroupChangeSummaryPageComponent {
  readonly isEditable = input<boolean>(false);
  readonly data = input.required<GroupChange>();

  readonly stepUrls = ProgressUpdateGroupChangeStepUrl;
  readonly contentMap = PU_GROUP_CHANGE_FORM_CONTENT;
}
