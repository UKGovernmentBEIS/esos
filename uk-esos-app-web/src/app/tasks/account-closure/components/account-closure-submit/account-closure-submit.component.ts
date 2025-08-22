import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { accountClosureQuery } from '@tasks/account-closure/+state/account-closure.selectors';
import { AccountClosureStep } from '@tasks/account-closure/account-closure-step-flow-manager';
import { AccountClosureTaskService } from '@tasks/account-closure/services/account-closure.service';

import { ButtonDirective } from 'govuk-components';

@Component({
  selector: 'esos-account-closure-submit',
  standalone: true,
  imports: [ButtonDirective, PageHeadingComponent],
  template: `<div class="govuk-grid-row">
    <div class="govuk-grid-column-two-thirds">
      <esos-page-heading class="govuk-!-margin-bottom-7" size="l">
        Are you sure you want to close this account?
      </esos-page-heading>
      <p class="govuk-body govuk-!-margin-bottom-7">
        The account will be permanently closed.
        <br />
        <br />
        All participant history will remain in the account, but no actions will be possible, for example starting new
        tasks or editing account information.
      </p>
      <div class="govuk-!-margin-bottom-8">
        <button type="submit" appPendingButton (click)="onSubmit()" govukWarnButton [disabled]="isSubmitDisabled()">
          Yes, close this account
        </button>
      </div>
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountClosureSubmitComponent {
  private reason = this.store.select(accountClosureQuery.selectReason);
  isSubmitDisabled = computed(() => !this.reason());

  constructor(
    private readonly service: AccountClosureTaskService,
    private readonly route: ActivatedRoute,
    private readonly store: RequestTaskStore,
  ) {}

  onSubmit() {
    this.service.submit({
      subtask: AccountClosureStep.SUBMIT,
      currentStep: AccountClosureStep.SUBMIT,
      route: this.route,
    });
  }
}
