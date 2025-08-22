import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import { ConditionalContentDirective } from '../../directives';

@Component({
  selector: 'govuk-checkbox',
  standalone: true,
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf],
})
export class CheckboxComponent<T> implements ControlValueAccessor {
  @Input() value: T;
  @Input() label: string;
  @Input() hint?: string;
  @Input() divider?: boolean;
  @ContentChild(ConditionalContentDirective) readonly conditional: ConditionalContentDirective;
  @ViewChild('conditionalTemplate', { static: true }) conditionalTemplate: TemplateRef<any>;
  @ViewChild('checkboxTemplate', { static: true }) optionTemplate: TemplateRef<any>;

  isChecked: boolean;
  index: number;
  isDisabled: boolean;
  isTouched: boolean;
  onBlur: () => any;
  onChange: (event: Event) => any;
  groupIdentifier: string;

  constructor(readonly changeDetectorRef: ChangeDetectorRef) {}

  get identifier(): string {
    return `${this.groupIdentifier}-${this.index}`;
  }

  registerOnChange(onChange: () => any): void {
    this.onChange = (event) => {
      this.writeValue((event.target as HTMLInputElement).checked);
      onChange();
    };
  }

  registerOnTouched(onBlur: () => any): void {
    this.onBlur = () => {
      this.isTouched = true;
      onBlur();
    };
  }

  writeValue(value: boolean): void {
    this.isChecked = value;
    this.setConditionalDisabledState();
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
    this.setConditionalDisabledState();
    this.changeDetectorRef.markForCheck();
  }

  private setConditionalDisabledState() {
    if (this.isChecked && !this.isDisabled) {
      this.conditional?.enableControls();
    } else {
      this.conditional?.disableControls();
    }
  }
}
