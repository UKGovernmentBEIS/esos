import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { accordionFactory } from '../accordion';
import { AccordionComponent } from '../accordion.component';
import { AccordionItemComponent } from './accordion-item.component';

describe('AccordionItemComponent', () => {
  let component: AccordionItemComponent;
  let fixture: ComponentFixture<TestComponent>;

  const getSectionButtons = (f: ComponentFixture<TestComponent>) =>
    f.nativeElement.querySelectorAll('.govuk-accordion__section-button');
  const getSectionHeaders = (f: ComponentFixture<TestComponent>) =>
    f.nativeElement.querySelectorAll('.govuk-accordion__section-header');

  @Component({
    standalone: true,
    imports: [AccordionComponent, AccordionItemComponent],
    template: `
      <govuk-accordion id="test-accordion" [openIndexes]="openIndexes">
        <govuk-accordion-item header="First item" summary="First item summary">
          <p>Content</p>
        </govuk-accordion-item>
        <govuk-accordion-item header="Second item">
          <p>Content</p>
        </govuk-accordion-item>
      </govuk-accordion>
    `,
  })
  class TestComponent {
    openIndexes = [2];
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [accordionFactory],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.debugElement.query(By.directive(AccordionItemComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have auto generated ids', () => {
    const headingButton = fixture.nativeElement.querySelector('.govuk-accordion__section-button');
    expect(headingButton.id).toEqual('test-accordion-heading-1');

    const summary = fixture.nativeElement.querySelector('.govuk-accordion__section-summary');
    expect(summary.id).toEqual('test-accordion-summary-1');

    const content = fixture.nativeElement.querySelector('.govuk-accordion__section-content');
    expect(content.id).toEqual('test-accordion-content-1');
    expect(content.getAttribute('aria-labelledby')).toEqual('test-accordion-heading-1');
  });

  it('should render content', () => {
    const contentDiv = fixture.nativeElement.querySelector('.govuk-accordion__section-content');
    expect(contentDiv.childNodes[0].tagName).toEqual('P');
    expect(contentDiv.childNodes[0].textContent).toEqual('Content');
  });

  it('should contain button with attributes', () => {
    const headingButtons = getSectionButtons(fixture);

    expect(headingButtons[0].getAttribute('aria-controls')).toEqual('test-accordion-content-1');
    expect(headingButtons[1].getAttribute('aria-controls')).toEqual('test-accordion-content-2');

    expect(headingButtons[0].getAttribute('aria-describedby')).toEqual('test-accordion-summary-1');
    expect(headingButtons[1].getAttribute('aria-describedby')).toBeNull();
  });

  it('should initialize with open indexes', () => {
    const sectionButtons = getSectionButtons(fixture);

    expect(sectionButtons[0].getAttribute('aria-expanded')).toEqual('false');
    expect(sectionButtons[1].getAttribute('aria-expanded')).toEqual('true');
  });

  it('should expand item on section click', () => {
    const headers = getSectionHeaders(fixture);
    const sectionButtons = getSectionButtons(fixture);

    headers[0].click();
    fixture.detectChanges();

    expect(sectionButtons[0].getAttribute('aria-expanded')).toEqual('true');
    expect(sectionButtons[1].getAttribute('aria-expanded')).toEqual('true');

    headers[1].click();
    fixture.detectChanges();

    expect(sectionButtons[0].getAttribute('aria-expanded')).toEqual('true');
    expect(sectionButtons[1].getAttribute('aria-expanded')).toEqual('false');

    headers[1].click();
    fixture.detectChanges();

    expect(sectionButtons[0].getAttribute('aria-expanded')).toEqual('true');
    expect(sectionButtons[1].getAttribute('aria-expanded')).toEqual('true');
  });

  it('should change header class on focus', () => {
    const headers = getSectionHeaders(fixture);
    const sectionButtons = getSectionButtons(fixture);

    sectionButtons[0].focus();
    fixture.detectChanges();

    expect(headers[0].classList).toContain('govuk-accordion__section-header--focused');
    expect(headers[1].classList).not.toContain('govuk-accordion__section-header--focused');

    sectionButtons[1].focus();
    fixture.detectChanges();

    expect(headers[0].classList).not.toContain('govuk-accordion__section-header--focused');
    expect(headers[1].classList).toContain('govuk-accordion__section-header--focused');
  });
});
