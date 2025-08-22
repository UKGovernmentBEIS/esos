import { Component, inject, Input } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';

import { OtherEstimationMethodHelpComponent } from '@shared/components/other-estimation-method-help/other-estimation-method-help.component';
import { EstimationMethodTypePipe } from '@shared/pipes/estimation-method-type.pipe';
import { existingControlContainer } from '@shared/providers/control-container.factory';

import { GovukComponentsModule } from 'govuk-components';

/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
@Component({
  selector: 'esos-fieldset-estimation-method-type',
  standalone: true,
  imports: [EstimationMethodTypePipe, GovukComponentsModule, ReactiveFormsModule, OtherEstimationMethodHelpComponent],
  templateUrl: './fieldset-estimation-method-type.component.html',
  viewProviders: [existingControlContainer],
})
export class FieldsetEstimationMethodTypeComponent implements ControlValueAccessor {
  private readonly ngControl = inject(NgControl, { self: true, optional: true });

  @Input({ required: true }) title: string;
  @Input({ required: true }) subtitle: string;
  @Input({ required: true }) options: string[];
  @Input({ required: true }) otherMethodLabel: string;

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
