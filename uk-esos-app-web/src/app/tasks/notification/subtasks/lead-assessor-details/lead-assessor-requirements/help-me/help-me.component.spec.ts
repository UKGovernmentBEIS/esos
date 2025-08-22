import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@testing';

import { HelpMeComponent } from './help-me.component';

describe('HelpMeComponent', () => {
  let component: HelpMeComponent;
  let fixture: ComponentFixture<HelpMeComponent>;
  let page: Page;

  class Page extends BasePage<HelpMeComponent> {
    get paragraphs() {
      return this.queryAll<HTMLParagraphElement>('p');
    }

    get lists() {
      return this.queryAll<HTMLLIElement>('li');
    }

    get summaryComponent() {
      return this.query<HTMLElement>('govuk-details');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(HelpMeComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML Elements', () => {
    expect(page.summaryComponent).toBeTruthy();
    expect(page.paragraphs).toHaveLength(4);
    expect(page.lists).toHaveLength(6);
  });
});
