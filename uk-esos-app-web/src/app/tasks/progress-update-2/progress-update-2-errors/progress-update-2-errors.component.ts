import { ChangeDetectionStrategy, Component, computed, OnDestroy, Signal, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProgressUpdate2SubmitActionComponent } from '../submit/action/action.component';
import {
  ProgressUpdate2ErrorSubtaskNameMapper,
  ProgressUpdate2ErrorUrlMapper,
} from './progress-update-2-errors.helper';
import { ProgressUpdate2ErrorData } from './progress-update-2-errors.interfaces';
import { ProgressUpdate2ErrorService } from './progress-update-2-errors.service';

@Component({
  selector: 'esos-progress-update-2-error',
  standalone: true,
  imports: [ProgressUpdate2SubmitActionComponent, RouterLink],
  templateUrl: './progress-update-2-errors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressUpdate2ErrorComponent implements OnDestroy {
  subtaskNameMapper = ProgressUpdate2ErrorSubtaskNameMapper;
  data: Signal<ProgressUpdate2ErrorData>;
  errorList = computed(() => {
    const errorData = this.data();

    if (errorData?.code === 'PU11002') {
      return [{ data: [['Submission not allowed.']], subtask: null, link: null }];
    }

    const list = [];
    errorData?.data[0].forEach((error) => {
      const errorMessages = error.data?.[0] || [];
      let subtask = null;

      errorMessages.forEach((message) => {
        Object.keys(ProgressUpdate2ErrorUrlMapper).forEach((subtaskKey) => {
          if (message.toLowerCase().includes(subtaskKey.toLowerCase())) {
            subtask = subtaskKey;
          }
        });

        list.push({
          data: [[message]],
          subtask,
          link: subtask ? `../../${ProgressUpdate2ErrorUrlMapper[subtask]}` : null,
        });
      });
    });

    return list;
  });

  constructor(
    private readonly router: Router,
    readonly progressUpdate2ErrorService: ProgressUpdate2ErrorService,
    readonly route: ActivatedRoute,
  ) {
    this.data = signal(this.router.getCurrentNavigation()?.extras?.state?.data);
  }

  ngOnDestroy(): void {
    this.progressUpdate2ErrorService.clear();
  }
}
