import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { ConfirmationSharedComponent } from '@shared/components/confirmation/confirmation.component';
import { CompetentAuthorityPipe } from '@shared/pipes/competent-authority.pipe';

import { LinkDirective } from 'govuk-components';

@Component({
  selector: 'esos-pu1-submit-confirmation',
  standalone: true,
  imports: [ConfirmationSharedComponent, LinkDirective, RouterLink],
  template: `
    <esos-confirmation-shared
      title="Progress Update 1 sent to regulator"
      [whatHappensNextTemplate]="whatHappensNextTemplate"
      titleReferenceText="Your reference is"
      [titleReferenceId]="requestId()"
    />

    <ng-template #whatHappensNextTemplate>
      <h3 class="govuk-heading-m">What happens next</h3>

      <p class="govuk-body">
        Progress Update 1 has been sent to {{ competentAuthorityName() }}.
        <a govukLink [routerLink]="['/contact-us']">Contact your regulator</a>
        if you need to make any updates to Progress Update 1.
      </p>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressUpdate1SubmitConfirmationComponent {
  requestId = this.store.select(requestTaskQuery.selectRequestId);
  competentAuthorityName = computed(() => {
    const competentAuthorityPipe = new CompetentAuthorityPipe();
    const competentAuthority = this.store.select(requestTaskQuery.selectRequestInfo)().competentAuthority;

    return competentAuthorityPipe.transform(competentAuthority);
  });

  constructor(private readonly store: RequestTaskStore) {}
}
