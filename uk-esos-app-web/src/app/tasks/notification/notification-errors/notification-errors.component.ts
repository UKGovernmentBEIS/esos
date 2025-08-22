/* eslint-disable @angular-eslint/component-max-inline-declarations */
import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, OnDestroy, Signal, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NotificationSubmitActionComponent } from '../submit/action/action.component';
import { NotificationErrorSubtaskNameMapper, NotificationErrorUrlMapper } from './notification-errors.helper';
import { NotificationErrorData } from './notification-errors.interfaces';
import { NotificationErrorService } from './notification-errors.service';

@Component({
  selector: 'esos-notification-error',
  standalone: true,
  imports: [NgIf, NgFor, NotificationSubmitActionComponent, RouterLink],
  templateUrl: './notification-errors.component.html',
  styles: [
    `
      .error-message-list {
        margin-top: 0px;
        margin-bottom: 0px;
      }
      .error-message {
        margin-top: 0px;
        margin-bottom: 0px;
      }
      .subtask-list {
        margin-bottom: 20px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationErrorComponent implements OnDestroy {
  subtaskNameMapper = NotificationErrorSubtaskNameMapper;
  data: Signal<NotificationErrorData>;
  errorList = computed(() => {
    const errorData = this.data();

    if (errorData?.code === 'NOC1002') {
      return [{ data: [['Submission not allowed.']], subtask: null, link: null }];
    }

    const list = [];
    errorData?.data[0].forEach((error) => {
      const sectionName = error.sectionName.split('.');
      const subtask = sectionName[sectionName.length - 1];

      return {
        data: error.data,
        subtask,
        link: subtask ? `../../../notification/${NotificationErrorUrlMapper[subtask]}` : null,
      };
    });

    return list;
  });

  constructor(
    readonly notificationErrorService: NotificationErrorService,
    readonly router: Router,
    readonly route: ActivatedRoute,
  ) {
    this.data = signal(router.getCurrentNavigation().extras.state.data);
  }

  ngOnDestroy(): void {
    this.notificationErrorService.clear();
  }
}
