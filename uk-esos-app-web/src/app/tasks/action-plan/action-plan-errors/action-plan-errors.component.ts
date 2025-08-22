import { ChangeDetectionStrategy, Component, computed, OnDestroy, Signal, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ActionPlanSubmitActionComponent } from '../submit/action/action.component';
import { ActionPlanErrorSubtaskNameMapper, ActionPlanErrorUrlMapper } from './action-plan-errors.helper';
import { ActionPlanErrorData } from './action-plan-errors.interfaces';
import { ActionPlanErrorService } from './action-plan-errors.service';

@Component({
  selector: 'esos-action-plan-error',
  standalone: true,
  imports: [ActionPlanSubmitActionComponent, RouterLink],
  templateUrl: './action-plan-errors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionPlanErrorComponent implements OnDestroy {
  subtaskNameMapper = ActionPlanErrorSubtaskNameMapper;
  data: Signal<ActionPlanErrorData>;
  errorList = computed(() => {
    const errorData = this.data();

    if (errorData?.code === 'AP1001') {
      return [{ data: [['Submission not allowed.']], subtask: null, link: null }];
    }

    const list = [];
    errorData?.data[0].forEach((error) => {
      const errorMessages = error.data?.[0] || [];
      let subtask = null;

      errorMessages.forEach((message) => {
        Object.keys(ActionPlanErrorUrlMapper).forEach((subtaskKey) => {
          if (message.toLowerCase().includes(subtaskKey.toLowerCase())) {
            subtask = subtaskKey;
          }
        });

        list.push({
          data: [[message]],
          subtask,
          link: subtask ? `../../${ActionPlanErrorUrlMapper[subtask]}` : null,
        });
      });
    });

    return list;
  });

  constructor(
    private readonly router: Router,
    readonly actionPlanErrorService: ActionPlanErrorService,
    readonly route: ActivatedRoute,
  ) {
    this.data = signal(this.router.getCurrentNavigation()?.extras?.state?.data);
  }

  ngOnDestroy(): void {
    this.actionPlanErrorService.clear();
  }
}
