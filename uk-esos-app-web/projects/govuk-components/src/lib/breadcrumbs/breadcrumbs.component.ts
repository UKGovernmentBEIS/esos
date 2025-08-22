import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'govuk-breadcrumbs',
  standalone: true,
  template: `
    <nav aria-label="Breadcrumb" class="govuk-breadcrumbs govuk-breadcrumbs--collapse-on-mobile">
        <ol class="govuk-breadcrumbs__list">
          <ng-content></ng-content>
        </ol>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {}
