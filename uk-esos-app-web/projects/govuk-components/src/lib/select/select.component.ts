import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, Input, Optional, Self } from '@angular/core';
import { ControlContainer, ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';

import { FormErrorDirective } from '../directives';
import { ErrorMessageComponent } from '../error-message';
import { FormService } from '../form';
import { FormInput } from '../form/form-input';
import { GovukSelectOption } from './select.interface';
import { GovukTextWidthClass } from './select.type';

/*
  eslint-disable
  @angular-eslint/prefer-on-push-component-change-detection,
  @typescript-eslint/no-empty-function,
  @angular-eslint/component-selector
*/
@Component({
  selector: 'div[govuk-select]',
  standalone: true,
  templateUrl: './select.component.html',
  imports: [ReactiveFormsModule, NgClass, FormErrorDirective, NgForOf, ErrorMessageComponent, NgIf],
})
export class SelectComponent extends FormInput implements ControlValueAccessor {
  @Input() options: GovukSelectOption[];
  @Input() widthClass: GovukTextWidthClass;
  @Input() isLabelHidden = true;
  currentLabel = 'Select';

  constructor(
    @Self() @Optional() ngControl: NgControl,
    formService: FormService,
    @Optional() container: ControlContainer,
  ) {
    super(ngControl, formService, container);
  }

  @Input() set label(label: string) {
    this.currentLabel = label;
    this.isLabelHidden = false;
  }

  writeValue(): void {}

  registerOnChange(): void {}

  registerOnTouched(): void {}
}
