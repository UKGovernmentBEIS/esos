import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'esos-internal-server-error',
  template: `
    <esos-page-heading size="xl">Sorry, there is a problem with the service</esos-page-heading>

    <p class="govuk-body">Try again later.</p>

    <p class="govuk-body">
      <a href="mailto:esos-it@environment-agency.gov.uk" govukLink class="govuk-!-font-weight-bold">
        Contact the ESOS helpdesk
      </a>
      if you have any questions.
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalServerErrorComponent {}
