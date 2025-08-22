import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ClassificationTypePipe } from '@shared/pipes/classification-type.pipe';
import { CompetentAuthorityLocationPipe } from '@shared/pipes/competent-authority-location.pipe';
import { SummaryHeaderComponent } from '@shared/summary-header/summary-header.component';

import { GovukComponentsModule } from 'govuk-components';

import { OrganisationAccountPayload } from 'esos-api';

@Component({
  selector: 'esos-organisation-account-summary',
  templateUrl: './organisation-account-summary.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    GovukComponentsModule,
    RouterLink,
    SummaryHeaderComponent,
    CompetentAuthorityLocationPipe,
    ClassificationTypePipe,
  ],
})
export class OrganisationAccountSummaryComponent {
  constructor(readonly route: ActivatedRoute) {}

  @Input() linkPrefix: string = 'organisation-account-application-review';
  @Input() organisation: OrganisationAccountPayload;
  @Input() isEditable = false;
  @Input() canChangeCA = true;
  @Input() canChangeRN = true;
}
