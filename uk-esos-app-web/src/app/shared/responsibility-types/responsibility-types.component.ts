import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { EnergyAssessmentTypesPipe } from '@shared/pipes/energy-assessment-types.pipe';

import { GovukComponentsModule } from 'govuk-components';

import { existingControlContainer } from '../providers/control-container.factory';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'esos-responsibility-types',
  templateUrl: './responsibility-types.component.html',
  standalone: true,
  imports: [EnergyAssessmentTypesPipe, GovukComponentsModule, ReactiveFormsModule],
  viewProviders: [existingControlContainer],
})
export class ResponsibilityTypesComponent {
  @Input() controlName: string;
  @Input() isSecondOfficer: boolean;
  @Input() hasNoEnergyResponsibility: boolean;
}
