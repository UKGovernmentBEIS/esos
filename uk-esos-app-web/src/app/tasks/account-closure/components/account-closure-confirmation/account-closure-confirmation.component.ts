import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { BreadcrumbService } from '@shared/breadcrumbs/breadcrumb.service';

import { LinkDirective, PanelComponent } from 'govuk-components';

@Component({
  selector: 'esos-account-closure-confirmation',
  standalone: true,
  imports: [LinkDirective, PanelComponent, RouterLink],
  template: `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <govuk-panel>
          <h1 class="govuk-panel__title">
            The organisation account {{ accountOrganisationId() }} is permanently closed
          </h1>
        </govuk-panel>
        <p class="govuk-body">The account has been permanently closed.</p>
        <a govukLink routerLink="/dashboard">Return to dashboard</a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountClosureConfirmationComponent implements OnInit {
  protected readonly breadcrumbs = inject(BreadcrumbService);

  accountOrganisationId = this.store.select(requestTaskQuery.selectAccountOrganisationId);

  constructor(private readonly store: RequestTaskStore) {}

  ngOnInit(): void {
    this.breadcrumbs.showDashboardBreadcrumb();
  }
}
