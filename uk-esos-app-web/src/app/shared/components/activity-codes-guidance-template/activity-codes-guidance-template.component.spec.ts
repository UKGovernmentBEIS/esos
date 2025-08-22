import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCodesGuidanceTemplateComponent } from '@shared/components/activity-codes-guidance-template/activity-codes-guidance-template.component';
import { BasePage } from '@testing';

describe('ActivityCodesGuidanceTemplateComponent', () => {
  let component: ActivityCodesGuidanceTemplateComponent;
  let fixture: ComponentFixture<ActivityCodesGuidanceTemplateComponent>;
  let page: Page;

  class Page extends BasePage<ActivityCodesGuidanceTemplateComponent> {
    get paragraphs() {
      return this.queryAll<HTMLParagraphElement>('p');
    }
    get rows() {
      return this.queryAll<HTMLTableRowElement>('govuk-table tr')
        .filter((el) => !el.querySelector('th'))
        .map((el) => Array.from(el.querySelectorAll('td')).map((td) => td.textContent.trim()));
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(ActivityCodesGuidanceTemplateComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML Elements', () => {
    expect(page.paragraphs).toHaveLength(6);
    expect(page.rows).toEqual([
      [
        'Retail trade, except of motor vehicles and motorcycles',
        'Retail sale of other goods in specialised store',
        'Retail sale of second-hand goods in stores',
        'Retail sale of second-hand goods (other than antiques and antique books) in stores',
      ],
      ['47', '47.7', '47.79', '47.79/9'],
    ]);
  });
});
