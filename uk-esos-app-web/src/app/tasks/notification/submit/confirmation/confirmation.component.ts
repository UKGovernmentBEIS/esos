import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { ConfirmationSharedComponent } from '@shared/components/confirmation/confirmation.component';
import { CompetentAuthorityPipe } from '@shared/pipes/competent-authority.pipe';

import { LinkDirective } from 'govuk-components';

@Component({
  selector: 'esos-notification-submit-confirmation',
  standalone: true,
  imports: [ConfirmationSharedComponent, LinkDirective, RouterLink],
  template: `
    <esos-confirmation-shared
      title="Notification sent to regulator"
      [whatHappensNextTemplate]="whatHappensNextTemplate"
      titleReferenceText="Your reference is"
      [titleReferenceId]="nocId()"
    ></esos-confirmation-shared>

    <ng-template #whatHappensNextTemplate>
      <h3 class="govuk-heading-m">What happens next</h3>

      <p class="govuk-body">
        The notification has been sent to {{ competentAuthorityName() }}.
        <a govukLink [routerLink]="['/contact-us']">Contact your regulator</a>
        if you need to make any updates to the notification.
      </p>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSubmitConfirmationComponent {
  nocId = this.store.select(requestTaskQuery.selectRequestId);
  competentAuthorityName = computed(() => {
    const competentAuthorityPipe = new CompetentAuthorityPipe();
    const competentAuthority = this.store.select(requestTaskQuery.selectRequestInfo)().competentAuthority;

    return competentAuthorityPipe.transform(competentAuthority);
  });

  constructor(private readonly store: RequestTaskStore) {}
}
