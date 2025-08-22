import { NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DetailsComponent } from 'govuk-components';

import { OrganisationAssociatedWithRU } from 'esos-api';

@Component({
  selector: 'esos-organisation-structure-help-content',
  standalone: true,
  imports: [DetailsComponent, NgSwitch, NgSwitchCase],
  templateUrl: './help-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpContentComponent {
  @Input() field: keyof OrganisationAssociatedWithRU | 'isPartOfArrangementRu' | 'isPartOfFranchiseRu';
}
