import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';

import { ButtonDirective } from 'govuk-components';

@Component({
  selector: 'esos-notification-return-to-submit-task-buttons',
  standalone: true,
  imports: [ButtonDirective, NgIf, RouterLink],
  template: `
    <div class="govuk-button-group" *ngIf="isEditable">
      <a govukButton [routerLink]="['notification', 'return-to-submit']">Return this notification</a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationReturnToSubmitTaskButtonsComponent {
  isEditable = this.store.select(requestTaskQuery.selectIsEditable)();

  constructor(readonly store: RequestTaskStore) {}
}
