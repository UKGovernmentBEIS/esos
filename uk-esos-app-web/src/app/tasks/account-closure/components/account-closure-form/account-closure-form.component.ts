import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { AccountClosureStep } from '@tasks/account-closure/account-closure-step-flow-manager';
import { AccountClosureTaskService } from '@tasks/account-closure/services/account-closure.service';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { ButtonDirective, TextareaComponent } from 'govuk-components';

import { accountClosureFormProvider } from './account-closure-form.provider';

@Component({
  selector: 'esos-account-closure-form',
  standalone: true,
  imports: [ButtonDirective, ReactiveFormsModule, RouterLink, TextareaComponent, WizardStepComponent],
  templateUrl: './account-closure-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [accountClosureFormProvider],
})
export class AccountClosureFormComponent {
  accountId = this.store.select(requestTaskQuery.selectRequestInfo)()?.accountId;

  constructor(
    @Inject(TASK_FORM) readonly form: FormGroup,
    private readonly service: AccountClosureTaskService,
    private readonly route: ActivatedRoute,
    private readonly store: RequestTaskStore,
  ) {}

  onSubmit() {
    this.service.save({
      subtask: AccountClosureStep.FORM,
      currentStep: AccountClosureStep.FORM,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.accountClosure = { reason: this.form.get('reason').value };
      }),
    });
  }
}
