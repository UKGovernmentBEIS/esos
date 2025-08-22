import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ShowHideComponent } from './show-hide.component';

describe('ShowHideComponent', () => {
  let component: ShowHideComponent;
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;

  @Component({
    template:
      '<esos-show-hide header="custom header" label="custom label" [itemIndex]="0"></esos-show-hide>',
    standalone: true,
    imports: [ShowHideComponent],
  })
  class TestComponent {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.debugElement.query(By.directive(ShowHideComponent)).componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the content', () => {
    expect(element.querySelector('.govuk-accordion-nav__chevron--down')).toBeTruthy;
    expect(element.querySelector('.govuk-accordion__show-all-text').textContent.trim()).toEqual(
      'Show custom header',
    );

    element.querySelector('button').click();
    fixture.detectChanges();

    expect(element.querySelector('.govuk-accordion-nav__chevron--down')).toBeFalsy;
    expect(element.querySelector('.govuk-accordion__show-all-text').textContent.trim()).toEqual(
      'Hide custom header',
    );
  });
});