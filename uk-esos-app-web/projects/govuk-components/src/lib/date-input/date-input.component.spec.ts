import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { DateInputComponent } from './date-input.component';

describe('DateInputComponent', () => {
  @Component({
    standalone: true,
    imports: [DateInputComponent, ReactiveFormsModule],
    template: '<div govuk-date-input [formControl]="control" [min]="min" [max]="max"></div>',
  })
  class TestComponent {
    control = new FormControl();
    min: Date;
    max: Date;
  }

  @Component({
    standalone: true,
    imports: [DateInputComponent, ReactiveFormsModule],
    template: '<div govuk-date-input [formControl]="control"></div>',
  })
  class Test2Component {
    control = new FormControl(null, Validators.required);
  }

  let component: DateInputComponent;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let component2: DateInputComponent;
  let hostComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let fixture2: ComponentFixture<Test2Component>;

  const changeValue = (input: DebugElement, value: string) => {
    input.triggerEventHandler('input', { target: { value } });
    input.triggerEventHandler('blur', { target: { value } });
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TestComponent, Test2Component],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    fixture2 = TestBed.createComponent(Test2Component);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(DateInputComponent)).componentInstance;
    component2 = fixture2.debugElement.query(By.directive(DateInputComponent)).componentInstance;
    fixture.detectChanges();
    fixture2.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hydrate form with a date', () => {
    hostComponent.control.patchValue(new Date('2020-05-29'));
    fixture.detectChanges();

    const hostElement: HTMLElement = fixture.nativeElement;
    const inputs = hostElement.querySelectorAll<HTMLInputElement>('input');

    expect(Array.from(inputs).map((input) => input.value)).toEqual(['29', '5', '2020']);
  });

  it('should emit events on user input', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    changeValue(inputs[0], '29');

    fixture.detectChanges();

    expect(hostComponent.control.value).toBeNull();

    changeValue(inputs[1], '5');
    changeValue(inputs[2], '2020');

    fixture.detectChanges();
    expect(hostComponent.control.value.toDateString()).toEqual(new Date('2020-05-29').toDateString());
  });

  it('should disable/enable the inputs', () => {
    hostComponent.control.disable();
    fixture.detectChanges();

    const hostElement: HTMLElement = fixture.nativeElement;
    let inputs = hostElement.querySelectorAll<HTMLInputElement>('input');

    inputs.forEach((input) => expect(input.disabled).toBeTruthy());

    hostComponent.control.enable();
    fixture.detectChanges();

    inputs = hostElement.querySelectorAll<HTMLInputElement>('input');

    inputs.forEach((input) => expect(input.disabled).toBeFalsy());
  });

  it('should set as touched only if every input is touched', () => {
    const hostElement = fixture.debugElement;
    const inputs = hostElement.queryAll(By.css('input'));

    inputs[0].triggerEventHandler('focus', {});
    inputs[0].triggerEventHandler('blur', {});
    fixture.detectChanges();

    expect(hostComponent.control.touched).toBeFalsy();

    inputs[1].triggerEventHandler('focus', {});
    inputs[1].triggerEventHandler('blur', {});
    fixture.detectChanges();

    expect(hostComponent.control.touched).toBeFalsy();

    inputs[2].triggerEventHandler('focus', {});
    inputs[2].triggerEventHandler('blur', {});
    fixture.detectChanges();

    expect(hostComponent.control.touched).toBeTruthy();
  });

  it('should not accept 29 Feb of leap year', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    changeValue(inputs[0], '29');
    changeValue(inputs[1], '2');
    changeValue(inputs[2], '2019');
    fixture.detectChanges();

    expect(hostComponent.control.invalid).toBeTruthy();
    let errorMessage = fixture.nativeElement.querySelector('.govuk-error-message');
    expect(errorMessage).not.toBeNull();

    changeValue(inputs[2], '2020');
    fixture.detectChanges();
    expect(hostComponent.control.valid).toBeTruthy();
    expect(hostComponent.control.value.toDateString()).toEqual(new Date('2020-02-29').toDateString());
    errorMessage = fixture.nativeElement.querySelector('.govuk-error-message');
    expect(errorMessage).toBeNull();
  });

  it('should not accept 30 Feb of any year', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    changeValue(inputs[0], '30');
    changeValue(inputs[1], '2');
    changeValue(inputs[2], '2019');
    fixture.detectChanges();

    expect(hostComponent.control.valid).not.toBeTruthy();

    changeValue(inputs[2], '2020');
    fixture.detectChanges();
    expect(hostComponent.control.valid).not.toBeTruthy();

    fixture.detectChanges();
    const errorMessage = fixture.nativeElement.querySelector('.govuk-error-message');
    expect(errorMessage).not.toBeNull();
  });

  it('should not accept 31 of short months', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    changeValue(inputs[0], '31');
    changeValue(inputs[1], '4');
    changeValue(inputs[2], '2020');
    fixture.detectChanges();

    expect(hostComponent.control.valid).not.toBeTruthy();

    let errorMessage = fixture.nativeElement.querySelector('.govuk-error-message');
    expect(errorMessage).not.toBeNull();

    changeValue(inputs[1], '5');
    fixture.detectChanges();
    expect(hostComponent.control.valid).toBeTruthy();
    expect(hostComponent.control.value.toDateString()).toEqual(new Date('2020-05-31').toDateString());
    errorMessage = fixture.nativeElement.querySelector('.govuk-error-message');
    expect(errorMessage).toBeNull();
  });

  it('should show incomplete errors', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    changeValue(inputs[0], '31');
    fixture.detectChanges();

    expect(hostComponent.control.valid).not.toBeTruthy();
    expect(hostComponent.control.errors.isIncomplete).toBeTruthy();
    const errorMessage = fixture.nativeElement.querySelector('.govuk-error-message');
    expect(errorMessage).not.toBeNull();
  });

  it('should show min errors', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    changeValue(inputs[0], '31');
    changeValue(inputs[1], '3');
    changeValue(inputs[2], '2020');
    fixture.detectChanges();

    expect(hostComponent.control.valid).toBeTruthy();
    expect(hostComponent.control.value.toDateString()).toEqual(new Date('2020-03-31').toDateString());
    let errorMessage = fixture.nativeElement.querySelector('.govuk-error-message');
    expect(errorMessage).toBeNull();

    hostComponent.min = new Date('2020-05-31');
    fixture.detectChanges();

    expect(hostComponent.control.valid).not.toBeTruthy();
    expect(hostComponent.control.errors.minDate).toBeTruthy();
    errorMessage = fixture.nativeElement.querySelector('.govuk-error-message');
    expect(errorMessage).not.toBeNull();
  });

  it('should show max errors', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    changeValue(inputs[0], '31');
    changeValue(inputs[1], '3');
    changeValue(inputs[2], '2020');
    fixture.detectChanges();

    expect(hostComponent.control.valid).toBeTruthy();
    expect(hostComponent.control.value.toDateString()).toEqual(new Date('2020-03-31').toDateString());
    let errorMessage = fixture.nativeElement.querySelector('.govuk-error-message');
    expect(errorMessage).toBeNull();

    hostComponent.max = new Date('2018-05-31');
    fixture.detectChanges();

    expect(hostComponent.control.valid).not.toBeTruthy();
    expect(hostComponent.control.errors.maxDate).toBeTruthy();
    errorMessage = fixture.nativeElement.querySelector('.govuk-error-message');
    expect(errorMessage).not.toBeNull();
  });

  it('should not accept month value over 12', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'));
    changeValue(inputs[1], '15');
    fixture.detectChanges();

    expect(hostComponent.control.valid).toBeFalsy();
  });
});
