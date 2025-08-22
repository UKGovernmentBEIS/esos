import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { existingControlContainer } from '@shared/providers/control-container.factory';

import { TextInputComponent } from 'govuk-components';

/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
@Component({
  selector: 'esos-energy-savings-categories-input-with-cost',
  templateUrl: './energy-savings-categories-input-with-cost.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent],
  viewProviders: [existingControlContainer],
})
export class EnergySavingsCategoriesInputWithCostComponent {}
