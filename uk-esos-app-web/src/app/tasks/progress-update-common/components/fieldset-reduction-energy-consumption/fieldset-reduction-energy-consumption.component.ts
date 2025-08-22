import { Component, inject, Input } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';

import { existingControlContainer } from '@shared/providers/control-container.factory';

import { TextInputComponent } from 'govuk-components';

/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
@Component({
  selector: 'esos-fieldset-reduction-energy-consumption',
  standalone: true,
  templateUrl: './fieldset-reduction-energy-consumption.component.html',
  imports: [ReactiveFormsModule, TextInputComponent],
  viewProviders: [existingControlContainer],
})
export class FieldsetReductionEnergyConsumptionComponent implements ControlValueAccessor {
  private readonly ngControl = inject(NgControl, { self: true, optional: true });

  @Input({ required: true }) title: string;
  @Input({ required: true }) subtitle: string;
  @Input() hasNestedStyles = false;

  constructor() {
    this.ngControl.valueAccessor = this;
  }

  get controlName() {
    return this.ngControl.name;
  }

  writeValue() {}
  registerOnChange() {}
  registerOnTouched() {}
  setDisabledState() {}
}
