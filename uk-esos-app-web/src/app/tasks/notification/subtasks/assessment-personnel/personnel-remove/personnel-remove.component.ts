import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { NotificationTaskPayload } from '@tasks/notification/notification.types';
import produce from 'immer';

import { GovukComponentsModule } from 'govuk-components';

import { NocP3 } from 'esos-api';

import { ASSESSMENT_PERSONNEL_SUB_TASK, AssessmentPersonnelCurrentStep } from '../assessment-personnel.helper';

@Component({
  selector: 'esos-personnel-remove',
  templateUrl: './personnel-remove.component.html',
  standalone: true,
  imports: [GovukComponentsModule, PageHeadingComponent, RouterLink, PendingButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PersonnelRemoveComponent {
  constructor(private readonly service: TaskService<NotificationTaskPayload>, private readonly route: ActivatedRoute) {}

  onDelete() {
    const personIndex = +this.route.snapshot.paramMap.get('personIndex');

    this.service.saveSubtask({
      subtask: ASSESSMENT_PERSONNEL_SUB_TASK,
      currentStep: AssessmentPersonnelCurrentStep.REMOVE,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        const personnel = payload.noc.assessmentPersonnel.personnel;

        if (personnel.length) {
          personnel.splice(personIndex, 1);
        }

        payload.noc = {
          ...(payload.noc ?? {}),
          assessmentPersonnel: {
            personnel,
          },
        } as NocP3;
      }),
    });
  }
}
