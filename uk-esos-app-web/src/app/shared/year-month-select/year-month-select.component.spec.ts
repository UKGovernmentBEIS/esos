import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { BasePage } from '@testing';
import { screen } from '@testing-library/angular';

import { GovukValidators } from 'govuk-components';

import { YearMonthSelectComponent } from './year-month-select.component';
import { endYearMonthDateValidator, startYearMonthDateValidator } from './year-month-select.validators';

describe('YearMonthSelectComponent', () => {
  const MIN_DATE: Date = new Date(2023, 11, 1);
  const MAX_DATE: Date = new Date(2027, 3, 1);

  @Component({
    standalone: true,
    imports: [YearMonthSelectComponent, ReactiveFormsModule],
    template: `<form [formGroup]="testFormGroup">
      <div
        esos-year-month-select
        formControlName="testControl"
        [minDate]="minDate"
        [maxDate]="maxDate"
        legend="Test control legend"
        hint="Test control hint"
      ></div>
      <button type="submit">Submit</button>
    </form>`,
  })
  class TestComponent {
    minDate = MIN_DATE;
    maxDate = MAX_DATE;
    testControl = new FormControl(null, [
      GovukValidators.required('Select date'),
      startYearMonthDateValidator('The date cannot be earlier than MIN_DATE', MIN_DATE),
      endYearMonthDateValidator('The date cannot be later than MAX_DATE', MAX_DATE),
    ]);
    testFormGroup = new FormGroup({ testControl: this.testControl });
  }

  let component: YearMonthSelectComponent;
  let hostComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let page: Page;

  class Page extends BasePage<TestComponent> {
    get errorMessageElement() {
      return this.query<HTMLSpanElement>('.govuk-error-message');
    }

    get monthElement() {
      return this.query<HTMLSelectElement>('#month-select-testControl');
    }

    set month(value: number) {
      this.setInputValue('#month-select-testControl', value);
    }

    get yearElement() {
      return this.query<HTMLSelectElement>('#year-select-testControl');
    }

    set year(value: number) {
      this.setInputValue('#year-select-testControl', value);
    }

    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, YearMonthSelectComponent, TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    page = new Page(fixture);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(YearMonthSelectComponent)).componentInstance;
    component.minDate = MIN_DATE;
    component.maxDate = MAX_DATE;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements and 0 errors', () => {
    expect(screen.getByText('Test control legend')).toBeTruthy();
    expect(screen.getByText('Test control hint')).toBeTruthy();
    expect(page.monthElement).toBeTruthy();
    expect(page.yearElement).toBeTruthy();
    expect(page.errorMessageElement).toBeFalsy();
  });

  it('should build year options from min and max date', () => {
    const minDateYear = MIN_DATE.getFullYear();
    const maxDateYear = MAX_DATE.getFullYear();
    const yearOptions = Array.from({ length: maxDateYear - minDateYear + 1 }, (_, i) => i + minDateYear);

    expect(component.yearOptions.map(({ value }) => value).filter((value) => value)).toEqual(yearOptions);
  });

  it('should apply a supplied value', () => {
    hostComponent.testControl.setValue('2025-11-01');
    fixture.detectChanges();

    expect(page.monthElement.value).toEqual('11: 10');
    expect(page.yearElement.value).toEqual('3: 2025');

    hostComponent.testControl.setValue(null);
    fixture.detectChanges();

    expect(page.monthElement.value).toEqual('0: null');
    expect(page.yearElement.value).toEqual('0: null');
  });

  it('should change value on month and year change', () => {
    expect(hostComponent.testControl.value).toEqual(null);

    page.month = 10;
    fixture.detectChanges();
    expect(hostComponent.testControl.value).toEqual(null);

    page.month = null;
    page.year = 2025;
    fixture.detectChanges();
    expect(hostComponent.testControl.value).toEqual(null);

    page.month = 10;
    fixture.detectChanges();
    expect(hostComponent.testControl.value).toEqual('2025-11-01');
  });

  it('should show an error when selected date is out of range', () => {
    expect(page.errorMessageElement).toBeFalsy();

    page.month = 2;
    page.year = 2023;
    page.submitButton.click();
    fixture.detectChanges();

    expect(page.errorMessageElement).toBeTruthy();
    expect(page.errorMessageElement.textContent.trim()).toContain('The date cannot be earlier than MIN_DATE');

    page.month = 11;
    page.year = 2027;
    fixture.detectChanges();

    expect(page.errorMessageElement).toBeTruthy();
    expect(page.errorMessageElement.textContent.trim()).toContain('The date cannot be later than MAX_DATE');

    page.year = 2025;
    fixture.detectChanges();

    expect(page.errorMessageElement).toBeFalsy();
  });

  it('should disable the control', () => {
    hostComponent.testControl.disable();
    fixture.detectChanges();
    expect(page.monthElement).toBeDisabled();
    expect(page.yearElement).toBeDisabled();
  });
});
