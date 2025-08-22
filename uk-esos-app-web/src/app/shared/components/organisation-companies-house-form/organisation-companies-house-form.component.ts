import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { existingControlContainer } from '@shared/providers/control-container.factory';
import { SharedModule } from '@shared/shared.module';

/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
@Component({
  selector: 'esos-organisation-companies-house-form',
  templateUrl: './organisation-companies-house-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, SharedModule],
  viewProviders: [existingControlContainer],
})
export class OrganisationCompaniesHouseFormComponent {}
