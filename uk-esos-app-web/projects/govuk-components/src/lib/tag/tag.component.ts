import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { TagColor } from './tag-color.type';

@Component({
  selector: 'govuk-tag',
  standalone: true,
  imports: [NgClass],
  template: `
    <strong class="govuk-tag" [ngClass]="color ? 'govuk-tag--' + color : null">
      <ng-content></ng-content>
    </strong>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  @Input() color: TagColor;
}
