import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import {
  mockProgressUpdate1P3AddedMeasure1,
  mockProgressUpdate1P3AddedMeasure2,
} from '@tasks/progress-update-1/testing/mock-data';
import { BasePage } from '@testing';

import { ProgressUpdate1P3AddedMeasure } from 'esos-api';

import { ProgressUpdate1AddedMeasureSummaryTemplateComponent } from './pu1-added-measure-summary-template.component';

describe('ProgressUpdate1AddedMeasureSummaryTemplateComponent', () => {
  let component: ProgressUpdate1AddedMeasureSummaryTemplateComponent;
  let fixture: ComponentFixture<ProgressUpdate1AddedMeasureSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<ProgressUpdate1AddedMeasureSummaryTemplateComponent> {
    get summaryListValues() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__row')
        .map((row) => [
          ...(Array.from(row.querySelectorAll('dt')) ?? []),
          ...(Array.from(row.querySelectorAll('dd')) ?? []),
        ])
        .map((pair) => pair.map((element) => element?.textContent?.trim()));
    }
  }

  function createComponent(mockData: ProgressUpdate1P3AddedMeasure) {
    TestBed.configureTestingModule({
      imports: [ProgressUpdate1AddedMeasureSummaryTemplateComponent, RouterModule.forRoot([])],
    });

    fixture = TestBed.createComponent(ProgressUpdate1AddedMeasureSummaryTemplateComponent);
    component = fixture.componentInstance;
    component.measure = mockData;
    page = new Page(fixture);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent(mockProgressUpdate1P3AddedMeasure1);
    expect(component).toBeTruthy();
  });

  it('should show summary values for mockProgressUpdate1P3AddedMeasure1', () => {
    createComponent(mockProgressUpdate1P3AddedMeasure1);

    expect(page.summaryListValues).toEqual([
      [
        'Does the reason for implementing the measure relate to another scheme or requirement? Select any that apply. (optional)',
        '',
      ],
      ['Reduction in energy consumption between 6 December 2024 and 5 December 2025', '1 kWh'],
      ['Reduction in energy consumption between 6 December 2023 and 5 December 2024 (optional)', ''],
      ['Estimation method', 'Energy audit'],
      ['Provide context to the measure (optional)', ''],
    ]);
  });

  it('should show summary values for mockProgressUpdate1P3AddedMeasure2', () => {
    createComponent(mockProgressUpdate1P3AddedMeasure2);

    expect(page.summaryListValues).toEqual([
      [
        'Does the reason for implementing the measure relate to another scheme or requirement? Select any that apply. (optional)',
        'Climate Change Agreements (CCAs)  Streamlined Energy and Carbon Reporting (SECR)  UK Emissions Trading Scheme (ETS)  UN Race to Zero  Science-Based Targets Initiative (SBTi)  Carbon Reduction Plans (required in the procurement of major Government contracts)  Other: Other6',
      ],
      ['Reduction in energy consumption between 6 December 2024 and 5 December 2025', '123 kWh'],
      ['Reduction in energy consumption between 6 December 2023 and 5 December 2024 (optional)', '456 kWh'],
      ['Estimation method', 'Energy audit'],
      ['Provide context to the measure (optional)', 'GG'],
    ]);
  });
});
