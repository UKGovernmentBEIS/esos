import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@testing';

import { AboutNocP3DescriptionComponent } from './about-noc-p3-description.component';

describe('AboutNocP3DescriptionComponent', () => {
  let component: AboutNocP3DescriptionComponent;
  let fixture: ComponentFixture<AboutNocP3DescriptionComponent>;
  let page: Page;

  class Page extends BasePage<AboutNocP3DescriptionComponent> {
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
    fixture = TestBed.createComponent(AboutNocP3DescriptionComponent);
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
    expect(page.lists).toHaveLength(4);
  });
});
