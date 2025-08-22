import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TagColor } from '../tag';

@Component({
  selector: 'govuk-phase-banner',
  standalone: true,
  imports: [NgIf, NgClass],
  template: `
    <div class="govuk-phase-banner">
      <div class="govuk-phase-banner__content">
        <strong
          *ngIf="phase"
          class="govuk-tag govuk-phase-banner__content__tag"
          [ngClass]="tagColor ? 'govuk-tag--' + tagColor : null"
        >
          {{ phase }}
        </strong>
        <span class="govuk-phase-banner__text">
          <ng-content></ng-content>
        </span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhaseBannerComponent {
  @Input() phase: string;
  @Input() tagColor: TagColor;
}
