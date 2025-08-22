import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { GovukSpacingUnit } from '../types';

@Component({
  selector: 'govuk-details',
  standalone: true,
  templateUrl: './details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent {
  @Input() summary: string;
  @Input() bottomSpacing: GovukSpacingUnit = 6;
}
