import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'esos-start-process',
  template: `
    <esos-page-heading>Create an Energy Savings Opportunity Scheme sign-in</esos-page-heading>
    <div class="govuk-body">
      <h2 class="govuk-heading-m">Before you start</h2>
      <p>To create a sign in, you'll need:</p>
      <ul>
        <li>a work email address that is not shared with anyone else</li>
        <li>a mobile phone, tablet or browser to set up two-factor authentication</li>
      </ul>
      <a govukButton routerLink="email"> Continue </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartProcessComponent {}
