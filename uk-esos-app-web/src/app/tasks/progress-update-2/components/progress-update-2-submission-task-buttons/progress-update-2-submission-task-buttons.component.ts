import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { progressUpdate2Query } from '@tasks/progress-update-2/+state/progress-update-2.selectors';

import { ButtonDirective } from 'govuk-components';

@Component({
  selector: 'esos-progress-update-2-submission-task-buttons',
  standalone: true,
  imports: [ButtonDirective, RouterLink],
  template: `
    @if (isEditable()) {
      <div class="govuk-button-group">
        <a
          govukButton
          [routerLink]="hasCompletedAllSections() ? ['progress-update-2', 'submit'] : []"
          [disabled]="!hasCompletedAllSections()"
        >
          Submit to regulator
        </a>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressUpdate2SubmissionTaskButtonsComponent {
  isEditable = this.store.select(requestTaskQuery.selectIsEditable);

  hasCompletedAllSections = this.store.select(progressUpdate2Query.selectCanSubmitProgressUpdate2);

  constructor(readonly store: RequestTaskStore) {}
}
