import { FormControl, ValidatorFn } from '@angular/forms';

import { isAfter, isBefore, parse } from 'date-fns';

import { GovukValidators, MessageValidatorFn } from 'govuk-components';

import { DEFAULT_DATE_STRING_FORMAT } from './year-month-select.component';

export const startYearMonthDateValidator = (
  message: string,
  start: Date,
  dateFormat = DEFAULT_DATE_STRING_FORMAT,
): MessageValidatorFn =>
  GovukValidators.builder(message, (control: FormControl<string>): { [key: string]: boolean } | null => {
    const date = parse(control.value, dateFormat, new Date());
    if (isBefore(date, start)) {
      return { isBeforeMinDate: true };
    }
    return null;
  });

export const endYearMonthDateValidator = (message: string, end: Date, dateFormat = DEFAULT_DATE_STRING_FORMAT): ValidatorFn =>
  GovukValidators.builder(message, (control: FormControl<string>): { [key: string]: boolean } | null => {
    const date = parse(control.value, dateFormat, new Date());
    if (isAfter(date, end)) {
      return { isAfterMaxDate: true };
    }
    return null;
  });
