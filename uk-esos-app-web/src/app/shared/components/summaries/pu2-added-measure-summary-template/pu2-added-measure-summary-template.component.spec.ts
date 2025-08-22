import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import {
  mockProgressUpdate2P3AddedMeasure1,
  mockProgressUpdate2P3AddedMeasure2,
} from '@tasks/progress-update-2/testing/mock-data';
import { BasePage } from '@testing';

import { ProgressUpdate2P3AddedMeasure } from 'esos-api';

import { ProgressUpdate2AddedMeasureSummaryTemplateComponent } from './pu2-added-measure-summary-template.component';

describe('ProgressUpdate2AddedMeasureSummaryTemplateComponent', () => {
  let component: ProgressUpdate2AddedMeasureSummaryTemplateComponent;
  let fixture: ComponentFixture<ProgressUpdate2AddedMeasureSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<ProgressUpdate2AddedMeasureSummaryTemplateComponent> {
    get summaryListValues() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__row')
        .map((row) => [
          ...(Array.from(row.querySelectorAll('dt')) ?? []),
          ...(Array.from(row.querySelectorAll('dd')) ?? []),
        ])
        .map((pair) => pair.map((element) => element?.textContent?.trim()));
    }
  }

  function createComponent(mockData: ProgressUpdate2P3AddedMeasure) {
    TestBed.configureTestingModule({
      imports: [ProgressUpdate2AddedMeasureSummaryTemplateComponent, RouterModule.forRoot([])],
    });

    fixture = TestBed.createComponent(ProgressUpdate2AddedMeasureSummaryTemplateComponent);
    component = fixture.componentInstance;
    component.measure = mockData;
    page = new Page(fixture);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent(mockProgressUpdate2P3AddedMeasure1);
    expect(component).toBeTruthy();
  });

  it('should show summary values for mockProgressUpdate2P3AddedMeasure1', () => {
    createComponent(mockProgressUpdate2P3AddedMeasure1);

    expect(page.summaryListValues).toEqual([
      [
        'Does the reason for implementing the measure relate to another scheme or requirement? Select any that apply. (optional)',
        '',
      ],
      ['Reduction in energy consumption between 6 December 2025 and 5 December 2026', '12 kWh'],
      ['Estimation method', 'No estimation method used'],
      ['Provide context to the measure (optional)', ''],
    ]);
  });

  it('should show summary values for mockProgressUpdate2P3AddedMeasure2', () => {
    createComponent(mockProgressUpdate2P3AddedMeasure2);

    expect(page.summaryListValues).toEqual([
      [
        'Does the reason for implementing the measure relate to another scheme or requirement? Select any that apply. (optional)',
        'Climate Change Agreements (CCAs)  Streamlined Energy and Carbon Reporting (SECR)  UK Emissions Trading Scheme (ETS)  UN Race to Zero  Science-Based Targets Initiative (SBTi)  Carbon Reduction Plans (required in the procurement of major Government contracts)  Other: Other6',
      ],
      ['Reduction in energy consumption between 6 December 2025 and 5 December 2026', '232 kWh'],
      ['Estimation method', 'Other estimation method  Another reasonable method'],
      ['Provide context to the measure (optional)', 'AA'],
    ]);
  });
});
