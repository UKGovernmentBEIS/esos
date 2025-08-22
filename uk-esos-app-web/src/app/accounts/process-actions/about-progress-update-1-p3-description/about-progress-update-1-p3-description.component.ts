import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DetailsComponent } from 'govuk-components';

@Component({
  selector: 'esos-about-progress-update-1-p3-description',
  standalone: true,
  imports: [DetailsComponent],
  templateUrl: './about-progress-update-1-p3-description.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutProgressUpdate1P3DescriptionComponent {}
