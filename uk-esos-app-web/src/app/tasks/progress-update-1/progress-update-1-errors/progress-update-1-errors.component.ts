import { ChangeDetectionStrategy, Component, computed, OnDestroy, Signal, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProgressUpdate1SubmitActionComponent } from '../submit/action/action.component';
import {
  ProgressUpdate1ErrorSubtaskNameMapper,
  ProgressUpdate1ErrorUrlMapper,
} from './progress-update-1-errors.helper';
import { ProgressUpdate1ErrorData } from './progress-update-1-errors.interfaces';
import { ProgressUpdate1ErrorService } from './progress-update-1-errors.service';

@Component({
  selector: 'esos-progress-update-1-error',
  standalone: true,
  imports: [ProgressUpdate1SubmitActionComponent, RouterLink],
  templateUrl: './progress-update-1-errors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressUpdate1ErrorComponent implements OnDestroy {
  subtaskNameMapper = ProgressUpdate1ErrorSubtaskNameMapper;
  data: Signal<ProgressUpdate1ErrorData>;
  errorList = computed(() => {
    const errorData = this.data();

    if (errorData?.code === 'PU11001') {
      return [{ data: [[errorData.message]], subtask: null, link: null }];
    } else if (errorData?.code === 'PU11002') {
      return [{ data: [['Submission not allowed.']], subtask: null, link: null }];
    }

    const list = [];
    errorData?.data[0].forEach((error) => {
      const errorMessages = error.data?.[0] || [];
      let subtask = null;

      errorMessages.forEach((message) => {
        Object.keys(ProgressUpdate1ErrorUrlMapper).forEach((subtaskKey) => {
          if (message.toLowerCase().includes(subtaskKey.toLowerCase())) {
            subtask = subtaskKey;
          }
        });

        list.push({
          data: [[message]],
          subtask,
          link: subtask ? `../../${ProgressUpdate1ErrorUrlMapper[subtask]}` : null,
        });
      });
    });

    return list;
  });

  constructor(
    private readonly router: Router,
    readonly progressUpdate1ErrorService: ProgressUpdate1ErrorService,
    readonly route: ActivatedRoute,
  ) {
    this.data = signal(this.router.getCurrentNavigation()?.extras?.state?.data);
  }

  ngOnDestroy(): void {
    this.progressUpdate1ErrorService.clear();
  }
}
