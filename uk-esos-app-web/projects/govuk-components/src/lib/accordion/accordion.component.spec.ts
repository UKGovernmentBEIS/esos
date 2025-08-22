import { AsyncPipe, NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { delay, of } from 'rxjs';

import { AccordionComponent } from './accordion.component';
import { AccordionItemComponent } from './accordion-item/accordion-item.component';

describe('AccordionComponent', () => {
  let component: AccordionComponent;
  let fixture: ComponentFixture<TestComponent>;

  @Component({
    standalone: true,
    template: `
      <govuk-accordion [id]="id">
        <govuk-accordion-item header="One">
          <p>Something about one</p>
        </govuk-accordion-item>
        <govuk-accordion-item header="Two">
          <a href="#">View</a>
        </govuk-accordion-item>
        <govuk-accordion-item *ngFor="let item of items$ | async" [header]="item.header">
          <div govukAccordionItemSummary>{{ item.summary }}</div>
          {{ item.content }}
        </govuk-accordion-item>
      </govuk-accordion>
    `,
    imports: [AccordionItemComponent, AccordionComponent, NgForOf, AsyncPipe],
  })
  class TestComponent {
    id = 'test-accordion';
    items$ = of([
      { header: 'Header 1', summary: 'Summary 1', content: 'Content' },
      { header: 'Header 2', summary: 'Summary 2', content: 'Content' },
    ]).pipe(delay(200));
  }

  const getAccordionElement: () => HTMLElement = () =>
    fixture.debugElement.query(By.directive(AccordionComponent)).nativeElement;

  const getToggleAllButton: () => HTMLButtonElement = () =>
    getAccordionElement().querySelector('button.govuk-accordion__show-all');

  const getAccordionItems: () => NodeListOf<Element> = () =>
    getAccordionElement().querySelectorAll('.govuk-accordion__section');

  const testToggleSections: () => void = () => {
    getToggleAllButton().click();
    fixture.detectChanges();

    expect(getToggleAllButton().textContent).toContain('Hide all sections');
    getAccordionItems().forEach((item) => expect(item.classList).toContain('govuk-accordion__section--expanded'));
    expect(getToggleAllButton().getAttribute('aria-expanded')).toEqual('true');

    getToggleAllButton().click();
    fixture.detectChanges();

    expect(getToggleAllButton().textContent).toContain('Show all sections');
    getAccordionItems().forEach((item) => expect(item.classList).not.toContain('govuk-accordion__section--expanded'));
    expect(getToggleAllButton().getAttribute('aria-expanded')).toEqual('false');
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionComponent, AccordionItemComponent, TestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.debugElement.query(By.directive(AccordionComponent)).componentInstance;

    sessionStorage.clear();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain an accordion with id', () => {
    const accordion = fixture.nativeElement.querySelector('#test-accordion');
    expect(accordion).toBeTruthy();
    expect(accordion.classList).toContain('govuk-accordion');
  });

  it('should render items and navigation buttons', () => {
    const expandButtons = getAccordionElement().querySelectorAll<HTMLButtonElement>(
      'button.govuk-accordion__section-button',
    );

    expandButtons.forEach((button) => button.click());

    fixture.detectChanges();

    expect(expandButtons.length).toEqual(2);
    expect(getAccordionElement().querySelector('p').textContent).toContain('Something about one');
    expect(getAccordionElement().querySelector('a').textContent).toContain('View');
  });

  it('should toggle all sections', () => {
    getAccordionItems().forEach((item) => expect(item.classList).not.toContain('govuk-accordion__section--expanded'));
    expect(getToggleAllButton().getAttribute('aria-expanded')).toEqual('false');

    testToggleSections();
  });

  it('should render items and navigation buttons dynamically', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    const expandButtons = getAccordionElement().querySelectorAll<HTMLButtonElement>(
      'button.govuk-accordion__section-button',
    );

    expandButtons.forEach((button) => button.click());

    fixture.detectChanges();

    expect(expandButtons.length).toEqual(4);
  });

  it('should toggle all sections dynamically', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    expect(getAccordionItems().length).toEqual(4);

    testToggleSections();
  });

  it('should open all if first already opened', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    const headingButtons = fixture.nativeElement.querySelectorAll('.govuk-accordion__section-button');
    headingButtons[0].click();
    fixture.detectChanges();

    expect(headingButtons[0].getAttribute('aria-expanded')).toEqual('true');

    testToggleSections();
  });
});
