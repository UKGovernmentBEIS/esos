import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DetailsComponent } from 'govuk-components';

@Component({
  selector: 'esos-other-estimation-method-help',
  standalone: true,
  imports: [DetailsComponent],
  templateUrl: './other-estimation-method-help.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtherEstimationMethodHelpComponent {}
