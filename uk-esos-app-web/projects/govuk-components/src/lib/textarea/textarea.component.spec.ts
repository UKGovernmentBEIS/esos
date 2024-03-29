import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';

import { FormErrorDirective } from '../directives';
import { ErrorMessageComponent } from '../error-message';
import { GovukValidators } from '../error-message';
import { TextareaComponent } from './textarea.component';

describe('TextareaComponent', () => {
  @Component({
    standalone: true,
    imports: [TextareaComponent, ReactiveFormsModule],
    template: '<div govuk-textarea [formControl]="control" [maxLength]="maxLength"></div>',
  })
  class TestComponent {
    control = new FormControl();
    maxLength: number;
  }

  let component: TextareaComponent;
  let hostComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserModule,
        TextareaComponent,
        TestComponent,
        ErrorMessageComponent,
        FormErrorDirective,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(TextareaComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the textarea', () => {
    hostComponent.control.disable();
    fixture.detectChanges();

    const hostElement: HTMLElement = fixture.nativeElement;
    const textarea = hostElement.querySelector<HTMLTextAreaElement>('textarea');

    expect(textarea.disabled).toBeTruthy();
  });

  it('should assign value', () => {
    const stringValue = 'This is a test';
    hostComponent.control.patchValue(stringValue);
    fixture.detectChanges();

    const hostElement: HTMLElement = fixture.nativeElement;
    const textarea = hostElement.querySelector<HTMLTextAreaElement>('textarea');
    expect(textarea.value).toEqual(stringValue);
  });

  it('should emit value', () => {
    const stringValue = ' This is a test \n Test \n\n';

    expect(hostComponent.control.value).toBeNull();

    hostComponent.control.patchValue(stringValue);

    expect(hostComponent.control.value).toEqual('This is a test \n Test');
  });

  it('should show character count info and error', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.govuk-character-count__message')).toBeNull();

    hostComponent.maxLength = 10;
    hostComponent.control.clearValidators();
    hostComponent.control.setValidators(GovukValidators.maxLength(10, 'no more than 10'));
    hostComponent.control.updateValueAndValidity();
    fixture.detectChanges();

    expect(element.querySelector('.govuk-character-count__message').textContent.trim()).toEqual('');
    expect(element.querySelector('.govuk-character-count__message.govuk-error-message')).toBeNull();

    const withinLimit = '1234567890';
    hostComponent.control.setValue(withinLimit);
    fixture.detectChanges();

    expect(element.querySelector('.govuk-character-count__message').textContent.trim()).toEqual(
      'You have 0 characters remaining',
    );
    expect(element.querySelector('.govuk-character-count__message.govuk-error-message')).toBeNull();

    const stringValue = '12345678901';
    hostComponent.control.setValue(stringValue);
    fixture.detectChanges();

    expect(element.querySelector('.govuk-character-count__message.govuk-error-message')).toBeTruthy();
    expect(element.querySelector('.govuk-character-count__message.govuk-error-message').textContent.trim()).toEqual(
      'You have 1 character too many',
    );
    expect(element.querySelector('.govuk-form-group--error')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.govuk-error-message')[0].textContent).toContain('no more than 10');
  });

  it('should display labelSize classes', () => {
    const hostElement: HTMLElement = fixture.nativeElement;
    const label = hostElement.querySelector('label');

    component.isLabelHidden = false;
    fixture.detectChanges();

    expect(label.className).toEqual('govuk-label');

    component.labelSize = 'normal';
    fixture.detectChanges();

    expect(label.className).toEqual('govuk-label');

    component.labelSize = 'small';
    fixture.detectChanges();

    expect(label.className).toEqual('govuk-label govuk-label--s');

    component.labelSize = 'medium';
    fixture.detectChanges();

    expect(label.className).toEqual('govuk-label govuk-label--m');

    component.labelSize = 'large';
    fixture.detectChanges();

    expect(label.className).toEqual('govuk-label govuk-label--l');
  });
});
