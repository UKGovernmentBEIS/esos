import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { SharedModule } from '@shared/shared.module';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { ProgressUpdate1TaskPayload } from '@tasks/progress-update-1/progress-update-1.types';
import { ProgressUpdate2TaskPayload } from '@tasks/progress-update-2/progress-update-2.types';
import { isProgressUpdate1, isProgressUpdate2 } from '@tasks/progress-update-common/pu-common.helpers';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import {
  ProgressUpdateGroupChangeStep,
  PU_GROUP_CHANGE_SUBTASK_NAME,
  PU_GROUP_CHANGE_SUBTASK_TITLE,
} from '../pu-group-change.helper';
import { groupChangeFormProvider } from './group-change-form.provider';
import { PU_GROUP_CHANGE_FORM_CONTENT } from './group-change-form-content';

@Component({
  selector: 'esos-group-change-form',
  standalone: true,
  imports: [ReactiveFormsModule, WizardStepComponent, SharedModule],
  templateUrl: './group-change-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [groupChangeFormProvider],
})
export class GroupChangeFormComponent {
  protected readonly contentMap = PU_GROUP_CHANGE_FORM_CONTENT;
  protected readonly caption = PU_GROUP_CHANGE_SUBTASK_TITLE;

  constructor(
    @Inject(TASK_FORM) protected readonly form: UntypedFormGroup,
    private readonly service: TaskService<ProgressUpdate1TaskPayload | ProgressUpdate2TaskPayload>,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  onSubmit() {
    this.service.saveSubtask({
      subtask: PU_GROUP_CHANGE_SUBTASK_NAME,
      currentStep: ProgressUpdateGroupChangeStep.FORM,
      route: this.activatedRoute,
      payload: produce(this.service.payload, (payload) => {
        if (isProgressUpdate1(payload)) {
          payload.progressUpdate1P3.groupChange = { ...this.form.value };
        } else if (isProgressUpdate2(payload)) {
          payload.progressUpdate2P3.groupChange = { ...this.form.value };
        }
      }),
    });
  }
}
