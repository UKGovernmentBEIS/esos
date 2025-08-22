import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskServiceExtended } from '@common/forms/services/task.service';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';

import { ButtonDirective, LinkDirective } from 'govuk-components';

@Component({
  selector: 'esos-return-to-submit-action',
  standalone: true,
  imports: [ButtonDirective, LinkDirective, PageHeadingComponent, RouterLink],
  template: `
    <esos-page-heading size="xl" caption="Return notification">
      Are you sure you want to return the notification?
    </esos-page-heading>

    <p class="govuk-body">You will not be able to make any changes after returning the notification.</p>

    <div class="govuk-button-group">
      <button type="button" appPendingButton (click)="returnToSubmit()" govukButton>Confirm and save</button>
      <a govukLink [routerLink]="['../../']"> Cancel </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnToSubmitActionComponent {
  constructor(
    private readonly service: TaskServiceExtended<NotificationTaskPayload>,
    readonly route: ActivatedRoute,
  ) {}

  returnToSubmit() {
    this.service.returnToSubmit({
      subtask: 'returnToSubmit',
      currentStep: 'action',
      route: this.route,
    });
  }
}
