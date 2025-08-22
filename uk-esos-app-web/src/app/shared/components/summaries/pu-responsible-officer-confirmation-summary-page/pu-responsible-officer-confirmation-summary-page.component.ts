import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProgressUpdateReviewPipe } from '@shared/pipes/pu-review.pipe';
import {
  ProgressUpdateResponsibleOfficerConfirmationStepUrl,
  PU_REVIEW_CONTENT,
} from '@tasks/progress-update-common/pu-responsible-officer-confirmation';

import { GovukComponentsModule } from 'govuk-components';

import { ProgressUpdate1P3, ProgressUpdate2P3 } from 'esos-api';

@Component({
  selector: 'esos-pu-responsible-officer-confirmation-summary-page',
  standalone: true,
  imports: [GovukComponentsModule, RouterLink, ProgressUpdateReviewPipe],
  templateUrl: './pu-responsible-officer-confirmation-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressUpdateResponsibleOfficerConfirmationComponent {
  readonly isEditable = input<boolean>(false);
  readonly data = input.required<
    ProgressUpdate1P3['responsibleOfficerConfirmation'] | ProgressUpdate2P3['responsibleOfficerConfirmation']
  >();

  readonly stepUrls = ProgressUpdateResponsibleOfficerConfirmationStepUrl;
  readonly reviewContentMap = PU_REVIEW_CONTENT;

  readonly sortedData = computed(() =>
    this.reviewContentMap.options.filter((option) => (this.data() as string[]).includes(option)),
  );
}
