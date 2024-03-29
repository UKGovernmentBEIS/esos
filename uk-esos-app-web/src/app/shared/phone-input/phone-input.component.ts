import { Component, DoCheck, HostBinding, Input, OnInit, Optional, Self } from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

import { BehaviorSubject, filter, map, Observable, takeUntil } from 'rxjs';

import { CountryService } from '@core/services/country.service';
import { CountryCallingCodeService } from '@core/services/country-calling-code.service';
import { DestroySubject } from '@core/services/destroy-subject.service';
import { UKCountryCodes } from '@shared/types';

import { FormService, GovukSelectOption } from 'govuk-components';

import { PhoneNumberDTO } from 'esos-api';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'div[esos-phone-input]',
  templateUrl: './phone-input.component.html',
  providers: [DestroySubject],
})
export class PhoneInputComponent implements OnInit, DoCheck, ControlValueAccessor {
  @Input() label: string;
  @Input() hint?: string;
  @HostBinding('class.govuk-!-display-block') readonly govukDisplayBlock = true;
  @HostBinding('class.govuk-form-group') readonly govukFormGroupClass = true;

  formGroup = new UntypedFormGroup({
    countryCode: new UntypedFormControl(),
    number: new UntypedFormControl(),
  });

  phoneCodes$: Observable<GovukSelectOption<string>[]> = this.countryService.getUkCountries().pipe(
    map((countries) => {
      const sortedCountries = this.sortByProp(countries, 'code');
      const options: { text: string; value: string }[] = [{ text: '', value: '' }];

      sortedCountries.forEach((country) => {
        const callingCode = this.countryCallingCodeService.getCountryCallingCode(country.code);
        const option = {
          text: `${UKCountryCodes.GB === country.code ? UKCountryCodes.UK : country.code} (${callingCode})`,
          value: String(callingCode),
        };
        options.push(option);
      });
      return this.sortByProp(options, 'text');
    }),
  );
  onChange: (phone: PhoneNumberDTO) => void;
  onBlur: () => void;
  private touch$ = new BehaviorSubject(false);

  constructor(
    @Self() @Optional() private readonly ngControl: NgControl,
    private readonly countryService: CountryService,
    private readonly formService: FormService,
    private readonly destroy$: DestroySubject,
    @Optional() private readonly container: ControlContainer,
    private readonly countryCallingCodeService: CountryCallingCodeService,
  ) {
    ngControl.valueAccessor = this;
  }

  @HostBinding('class.govuk-form-group--error') get govukFormGroupErrorClass() {
    return this.shouldDisplayErrors;
  }

  get shouldDisplayErrors(): boolean {
    return this.control?.invalid && (!this.form || this.form.submitted);
  }

  get control(): UntypedFormControl {
    return this.ngControl.control as UntypedFormControl;
  }

  get id(): string {
    return this.formService.getControlIdentifier(this.ngControl);
  }

  private get form(): FormGroupDirective | NgForm | null {
    return this.container &&
      (this.container.formDirective instanceof FormGroupDirective || this.container.formDirective instanceof NgForm)
      ? this.container.formDirective
      : null;
  }

  ngOnInit(): void {
    this.formGroup.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(() => !!this.onChange),
      )
      .subscribe((value) => this.onChange({ countryCode: value.countryCode || null, number: value.number || null }));
  }

  ngDoCheck(): void {
    if (this.touch$.getValue() !== this.control.touched && this.control.touched) {
      this.formGroup.markAllAsTouched();
      this.touch$.next(this.control.touched);
    }
  }

  onInputBlur(): void {
    if (Object.values(this.formGroup.controls).every((control) => control.touched)) {
      this.onBlur();
      this.touch$.next(true);
    }
  }

  registerOnChange(fn: (phone: PhoneNumberDTO) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(onBlur: () => any): void {
    this.onBlur = onBlur;
  }

  writeValue(value: PhoneNumberDTO): void {
    if (value) {
      this.formGroup.get('countryCode').setValue(value.countryCode);
      this.formGroup.get('number').setValue(value.number);
    }
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.formGroup.disable();
    } else {
      this.formGroup.enable();
    }
  }

  sortByProp(items: any[], prop: string) {
    return items.sort((a, b) => (a[prop] > b[prop] ? 1 : -1));
  }
}
