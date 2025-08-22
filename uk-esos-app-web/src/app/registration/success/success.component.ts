import { ChangeDetectionStrategy, Component } from '@angular/core';

import { UserRegistrationStore } from '../store/user-registration.store';

@Component({
  selector: 'esos-success',
  template: `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <govuk-panel title="You've successfully created a user account"></govuk-panel>
        <p class="govuk-body">Your GOV.UK One Login is now linked to your ESOS user account.</p>
        <p class="govuk-body">We've sent you an email with your user account details.</p>
        <h3 class="govuk-heading-m">What happens next</h3>
        <p class="govuk-body">
          <ng-container *ngIf="isInvited$ | async as isInvited; else nonInvited">
            Your user account must be activated by Regulator.
          </ng-container>
          <ng-template #nonInvited>
            You can now apply to create a new organisation account so you can start your ESOS reporting.
          </ng-template>
        </p>
        <button type="button" (click)="goToLanding()" govukButton>Continue</button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessComponent {
  isInvited$ = this.store.select('isInvited');

  constructor(private readonly store: UserRegistrationStore) {}

  goToLanding(): void {
    window.location.href = '/';
  }
}
