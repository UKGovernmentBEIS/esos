import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ButtonDirective } from './button.directive';

describe('ButtonDirective', () => {
  let directive: ButtonDirective;
  let fixture: ComponentFixture<TestComponent>;

  @Component({
    standalone: true,
    imports: [ButtonDirective],
    template: `
      <button #simple govukButton (click)="onClick()">Simple button</button>
      <button #warn govukWarnButton>Warn button</button>
      <button #secondary govukSecondaryButton>Secondary button</button>
      <button #disabled govukButton [disabled]="true">Disabled button</button>
    `,
  })
  class TestComponent {
    @ViewChild('simple', { read: ElementRef }) simpleButton: ElementRef;
    @ViewChild('warn', { read: ElementRef }) warnButton: ElementRef;
    @ViewChild('secondary', { read: ElementRef }) secondaryButton: ElementRef;
    @ViewChild('disabled', { read: ElementRef }) disabledButton: ElementRef;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClick(): void {}
  }

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [TestComponent],
    }).createComponent(TestComponent);

    fixture.detectChanges();
    directive = fixture.debugElement.query(By.directive(ButtonDirective)).injector.get(ButtonDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should have govuk button class', () => {
    Object.values(fixture.componentInstance)
      .filter((e) => !!e.nativeElement)
      .forEach((elementRef: ElementRef) => {
        expect(elementRef.nativeElement.classList).toContain('govuk-button');
      });
  });

  it('should have disabled class (disabled button)', () => {
    const element: HTMLButtonElement = fixture.componentInstance.disabledButton.nativeElement;
    expect(element.classList).toContain('govuk-button--disabled');
  });

  it('should have aria-disabled attribute (disabled button)', () => {
    const element: HTMLButtonElement = fixture.componentInstance.disabledButton.nativeElement;
    expect(element.hasAttribute('aria-disabled')).toBeTruthy();
    expect(element.getAttribute('aria-disabled')).toEqual('true');
  });

  it('should not have aria-disabled attribute (simple button)', () => {
    const element: HTMLButtonElement = fixture.componentInstance.simpleButton.nativeElement;
    expect(element.hasAttribute('aria-disabled')).toBeFalsy();
  });

  it('should have warning attribute (warn button)', () => {
    const element: HTMLButtonElement = fixture.componentInstance.warnButton.nativeElement;
    expect(element.hasAttribute('govukwarnbutton')).toBeTruthy();
  });

  it('should have secondary attribute (secondary button)', () => {
    const element: HTMLButtonElement = fixture.componentInstance.secondaryButton.nativeElement;
    expect(element.hasAttribute('govuksecondarybutton')).toBeTruthy();
  });

  it('should not get clicked if keydown is not space', fakeAsync(() => {
    const event = new KeyboardEvent('keydown', {
      key: 'enter',
      code: 'Enter',
      cancelable: true,
    });
    jest.spyOn(fixture.componentInstance, 'onClick');
    const button: HTMLButtonElement = fixture.componentInstance.simpleButton.nativeElement;
    button.dispatchEvent(event);
    expect(fixture.componentInstance.onClick).toHaveBeenCalledTimes(0);
  }));

  it('should get clicked if keydown is space', fakeAsync(() => {
    const event = new KeyboardEvent('keydown', { key: ' ', code: 'Space' });
    jest.spyOn(fixture.componentInstance, 'onClick');
    const button: HTMLButtonElement = fixture.componentInstance.simpleButton.nativeElement;
    button.dispatchEvent(event);
    expect(fixture.componentInstance.onClick).toHaveBeenCalledTimes(1);
  }));
});
