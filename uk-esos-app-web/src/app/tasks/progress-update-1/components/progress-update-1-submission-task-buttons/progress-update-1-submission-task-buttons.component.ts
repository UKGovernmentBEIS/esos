import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { progressUpdate1Query } from '@tasks/progress-update-1/+state/progress-update-1.selectors';

import { ButtonDirective } from 'govuk-components';

@Component({
  selector: 'esos-progress-update-1-submission-task-buttons',
  standalone: true,
  imports: [ButtonDirective, RouterLink],
  template: `
    @if (isEditable()) {
      <div class="govuk-button-group">
        <a
          govukButton
          [routerLink]="hasCompletedAllSections() ? ['progress-update-1', 'submit'] : []"
          [disabled]="!hasCompletedAllSections()"
        >
          Submit to regulator
        </a>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressUpdate1SubmissionTaskButtonsComponent {
  isEditable = this.store.select(requestTaskQuery.selectIsEditable);

  hasCompletedAllSections = this.store.select(progressUpdate1Query.selectCanSubmitProgressUpdate1);

  constructor(readonly store: RequestTaskStore) {}
}
