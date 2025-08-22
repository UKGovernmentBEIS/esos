import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { map } from 'rxjs';

@Component({
  selector: 'esos-invitation',
  template: `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <govuk-panel
          title="You have been added as a user to the account of {{
            (operatorInvitedUserInfoDTO$ | async)?.accountName
          }}"
        ></govuk-panel>
        <p class="govuk-body">Your GOV.UK One Login is connected to ESOS account. You won't need to do this again.</p>
        <h3 class="govuk-heading-m">What happens next</h3>
        <p class="govuk-body">
          Use your GOV.UK One Login whenever you sign in to the Energy Savings Opportunity Scheme.
        </p>
        <p class="govuk-body">We'll keep sending ESOS emails to the address already linked to your ESOS account.</p>
        <button type="button" (click)="goToLanding()" govukButton>Continue to your ESOS service</button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationComponent {
  operatorInvitedUserInfoDTO$ = this.activatedRoute.data.pipe(map((data) => data?.operatorInvitedUserInfoDTO));

  constructor(private readonly activatedRoute: ActivatedRoute) {}

  goToLanding(): void {
    window.location.href = '/';
  }
}
