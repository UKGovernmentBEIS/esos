import { Component, DoCheck, HostBinding, inject, Input, OnInit, Optional, Self } from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgControl,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';

import { BehaviorSubject, filter, takeUntil } from 'rxjs';

import { DestroySubject } from '@core/services/destroy-subject.service';
import { format, isAfter, isValid, isWithinInterval, parse } from 'date-fns';

import { FormService, GovukComponentsModule, GovukSelectOption, LegendSizeType } from 'govuk-components';

export const DEFAULT_DATE_STRING_FORMAT = 'y-MM-dd';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'div[esos-year-month-select]',
  templateUrl: './year-month-select.component.html',
  styleUrl: './year-month-select.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, GovukComponentsModule],
  providers: [DestroySubject],
})
export class YearMonthSelectComponent implements OnInit, DoCheck, ControlValueAccessor {
  private readonly destroy$ = inject(DestroySubject);

  @Input() legend: string;
  @Input() legendSize: LegendSizeType = 'medium';
  @Input() hint?: string;

  @Input() dateFormat: string = DEFAULT_DATE_STRING_FORMAT;

  @Input({ required: true }) set minDate(value: Date | string) {
    this._minDate = typeof value === 'string' ? this.parseDate(value) : value;
  }
  private _minDate: Date;

  @Input({ required: true }) set maxDate(value: Date | string) {
    this._maxDate = typeof value === 'string' ? this.parseDate(value) : value;
  }
  private _maxDate: Date;

  @HostBinding('class.govuk-!-display-block') readonly govukDisplayBlock = true;
  @HostBinding('class.govuk-form-group') readonly govukFormGroupClass = true;
  @HostBinding('class.govuk-form-group--error') get govukFormGroupErrorClass() {
    return this.shouldDisplayErrors;
  }

  get shouldDisplayErrors(): boolean {
    return this.control?.invalid && (!this.form || this.form.submitted);
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  get identifier(): string {
    return this.formService.getControlIdentifier(this.ngControl);
  }

  formGroup = new FormGroup({
    year: new FormControl<number>(null),
    month: new FormControl<number>(null),
  });

  private _date: Date = null;

  private get form(): FormGroupDirective | NgForm | null {
    return this.container &&
      (this.container.formDirective instanceof FormGroupDirective || this.container.formDirective instanceof NgForm)
      ? this.container.formDirective
      : null;
  }

  onChange: (dateString: string) => void;
  onBlur: () => void;
  private touch$ = new BehaviorSubject(false);

  yearOptions: GovukSelectOption[] = [{ text: 'Choose year', value: null }];

  monthOptions: GovukSelectOption[] = [
    { text: 'Choose month', value: null },
    { text: 'January', value: 0 },
    { text: 'February', value: 1 },
    { text: 'March', value: 2 },
    { text: 'April', value: 3 },
    { text: 'May', value: 4 },
    { text: 'June', value: 5 },
    { text: 'July', value: 6 },
    { text: 'August', value: 7 },
    { text: 'September', value: 8 },
    { text: 'October', value: 9 },
    { text: 'November', value: 10 },
    { text: 'December', value: 11 },
  ];

  constructor(
    @Self() @Optional() private readonly ngControl: NgControl,
    private readonly formService: FormService,
    @Optional() private readonly container: ControlContainer,
  ) {
    ngControl.valueAccessor = this;
  }

  ngOnInit(): void {
    if (!isValid(this._minDate) || !isValid(this._maxDate) || isAfter(this._minDate, this._maxDate)) {
      throw new Error('Invalid minDate or maxDate Input()');
    }

    this.buildYearOptions();

    this.formGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(() => !!this.onChange),
      )
      .subscribe((formData) => {
        this._date =
          formData.year === null || formData.month === null ? null : new Date(formData.year, formData.month, 1);
        this.onChange(this.formatDate(this._date));
      });
  }

  private buildYearOptions(): void {
    const minYear = this._minDate.getFullYear();
    const maxYear = this._maxDate.getFullYear();

    for (let year = minYear; year <= maxYear; year++) {
      this.yearOptions.push({ text: year.toString(), value: year });
    }
  }

  ngDoCheck(): void {
    if (this.touch$.getValue() !== this.control.touched && this.control.touched) {
      this.formGroup.markAllAsTouched();
      this.touch$.next(this.control.touched);
    }
  }

  registerOnChange(fn: (dateString: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(onBlur: () => any): void {
    this.onBlur = onBlur;
  }

  writeValue(value: string): void {
    const date = value ? this.parseDate(value) : null;
    this._date = this.isWithinInterval(date) ? date : null;
    this.formGroup.setValue({
      year: this._date?.getFullYear() ?? null,
      month: this._date?.getMonth() ?? null,
    });
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formGroup.disable() : this.formGroup.enable();
  }

  private parseDate(dateString: string): Date {
    return dateString ? parse(dateString, this.dateFormat, new Date()) : null;
  }

  private formatDate(date: Date): string {
    return date ? format(date, this.dateFormat) : null;
  }

  private isWithinInterval(date: Date): boolean {
    return isWithinInterval(date, { start: this._minDate, end: this._maxDate });
  }
}
