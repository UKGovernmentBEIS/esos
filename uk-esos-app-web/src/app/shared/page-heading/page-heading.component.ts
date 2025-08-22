import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { GovukSpacingUnit } from 'govuk-components';

@Component({
  selector: 'esos-page-heading',
  standalone: true,
  template: `
    @if (caption) {
      <span [class]="'govuk-caption-' + size">{{ caption }}</span>
    }
    <h1 [class]="'govuk-heading-' + size + ' govuk-!-margin-bottom-' + bottomSpacing">
      <ng-content></ng-content>
    </h1>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeadingComponent {
  @Input() caption: string;
  @Input() size: 'l' | 'xl' = 'l';
  @Input() bottomSpacing: GovukSpacingUnit = 6;
}
