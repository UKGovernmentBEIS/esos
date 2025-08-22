import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'esos-regulator-confirmation',
  template: `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <govuk-panel>You've successfully created a user account</govuk-panel>
        <p class="govuk-body">Your GOV.UK One Login is now linked to your ESOS user account.</p>
        <p class="govuk-body">We've sent you an email with your user account details.</p>
        <h3 class="govuk-heading-m">What happens next</h3>
        <p class="govuk-body">Your user account must be activated by Regulator.</p>
        <button type="button" (click)="goToLanding()" govukButton>Continue</button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationConfirmationComponent {
  goToLanding(): void {
    window.location.href = '/';
  }
}
