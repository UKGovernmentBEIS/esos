import { NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { AfterContentInit, Component, ContentChildren, Input, Optional, QueryList, Self } from '@angular/core';
import { ControlContainer, ControlValueAccessor, NgControl, UntypedFormBuilder } from '@angular/forms';

import { ErrorMessageComponent } from '../error-message';
import { FieldsetDirective, FieldsetHintDirective, LegendDirective, LegendSizeType } from '../fieldset';
import { FormService } from '../form';
import { FormInput } from '../form/form-input';
import { CheckboxComponent } from './checkbox/checkbox.component';

/*
  eslint-disable
  @angular-eslint/prefer-on-push-component-change-detection,
  @angular-eslint/component-selector
 */
@Component({
  selector: 'div[govuk-checkboxes]',
  standalone: true,
  templateUrl: './checkboxes.component.html',
  imports: [
    ErrorMessageComponent,
    NgTemplateOutlet,
    NgForOf,
    LegendDirective,
    FieldsetHintDirective,
    FieldsetDirective,
    NgIf,
  ],
})
export class CheckboxesComponent<T> extends FormInput implements AfterContentInit, ControlValueAccessor {
  @Input() legend?: string;
  @Input() legendSize?: LegendSizeType = 'large';
  @Input() hint?: string;
  @Input() size?: 'small';
  @ContentChildren(CheckboxComponent) readonly options: QueryList<CheckboxComponent<T>>;
  private onBlur: () => any;
  private onChange: (value: T[]) => void;
  private currentValue: T[] = [];

  constructor(
    @Self() @Optional() ngControl: NgControl,
    formService: FormService,
    private readonly fb: UntypedFormBuilder,
    @Optional() container: ControlContainer,
  ) {
    super(ngControl, formService, container);
  }

  ngAfterContentInit(): void {
    this.options.forEach((option, index) => {
      option.groupIdentifier = this.identifier;
      option.index = index;
      option.registerOnChange(() => {
        this.currentValue = this.options.filter((option) => option.isChecked).map((option) => option.value);
        this.onChange(this.currentValue);
      });
      option.registerOnTouched(() => this.onInputBlur());
      option.changeDetectorRef.markForCheck();
    });

    this.writeValue(this.control.value);
    this.setDisabledState(this.control.disabled);
  }

  writeValue(value: T[]): void {
    this.currentValue = value;
    this.options?.forEach((option) => option.writeValue(value?.includes(option.value) ?? false));
  }

  registerOnChange(fn: (value: T[]) => void) {
    this.onChange = fn;
  }

  registerOnTouched(onBlur: () => any): void {
    this.onBlur = onBlur;
  }

  setDisabledState(isDisabled: boolean): void {
    this.options?.forEach((option) => option.setDisabledState(isDisabled));
  }

  onInputBlur(): void {
    if (!this.options || Array.from(this.options).every((option) => option.isTouched)) {
      this.onBlur();
    }
  }
}
