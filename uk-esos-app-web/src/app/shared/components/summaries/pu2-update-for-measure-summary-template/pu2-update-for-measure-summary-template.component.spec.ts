import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import {
  mockProgressUpdate2P3Measure1,
  mockProgressUpdate2P3Measure2,
  mockProgressUpdate2P3Measure3,
  mockProgressUpdate2P3Measure4,
} from '@tasks/progress-update-2/testing/mock-data';
import { BasePage } from '@testing';

import { ProgressUpdate1P3EnergyEfficiencyMeasure } from 'esos-api';

import { ProgressUpdate2UpdateForMeasureSummaryTemplateComponent } from './pu2-update-for-measure-summary-template.component';

describe('ProgressUpdate2UpdateForMeasureSummaryTemplateComponent', () => {
  let component: ProgressUpdate2UpdateForMeasureSummaryTemplateComponent;
  let fixture: ComponentFixture<ProgressUpdate2UpdateForMeasureSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<ProgressUpdate2UpdateForMeasureSummaryTemplateComponent> {
    get summaryListValues() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__row')
        .map((row) => [
          ...(Array.from(row.querySelectorAll('dt')) ?? []),
          ...(Array.from(row.querySelectorAll('dd')) ?? []),
        ])
        .map((pair) => pair.map((element) => element?.textContent?.trim()));
    }
  }

  function createComponent(mockData: ProgressUpdate1P3EnergyEfficiencyMeasure) {
    TestBed.configureTestingModule({
      imports: [ProgressUpdate2UpdateForMeasureSummaryTemplateComponent, RouterModule.forRoot([])],
    });

    fixture = TestBed.createComponent(ProgressUpdate2UpdateForMeasureSummaryTemplateComponent);
    component = fixture.componentInstance;
    component.updateForMeasure = mockData;
    page = new Page(fixture);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent(mockProgressUpdate2P3Measure1.progressUpdate2P3EnergyEfficiencyMeasure);
    expect(component).toBeTruthy();
  });

  it('should show summary values for mockProgressUpdate2P3Measure1', () => {
    createComponent(mockProgressUpdate2P3Measure1.progressUpdate2P3EnergyEfficiencyMeasure);

    expect(page.summaryListValues).toEqual([
      [
        'Do you want, optionally, to report a reduction in energy consumption for the period between 6 December 2025 and 5 December 2026?',
        'No',
      ],
      ['Provide context (optional)', 'CTX1'],
    ]);
  });

  it('should show summary values for mockProgressUpdate2P3Measure2', () => {
    createComponent(mockProgressUpdate2P3Measure2.progressUpdate2P3EnergyEfficiencyMeasure);

    expect(page.summaryListValues).toEqual([
      ['Has the measure been implemented?', 'Yes'],
      ['Was the measure implemented by the date proposed in the action plan?', 'Yes'],
      ['Reduction in energy consumption between 6 December 2025 and 5 December 2026', '2143 kWh'],
      ['Estimation method', 'Estimate in the action plan'],
      ['Provide context (optional)', ''],
    ]);
  });

  it('should show summary values for mockProgressUpdate2P3Measure3', () => {
    createComponent(mockProgressUpdate2P3Measure3.progressUpdate2P3EnergyEfficiencyMeasure);

    expect(page.summaryListValues).toEqual([
      [
        'Do you want, optionally, to report a reduction in energy consumption for the period between 6 December 2025 and 5 December 2026?',
        'No',
      ],
      ['Provide context (optional)', 'CTX PU2 M3'],
    ]);
  });

  it('should show summary values for mockProgressUpdate2P3Measure4', () => {
    createComponent(mockProgressUpdate2P3Measure4.progressUpdate2P3EnergyEfficiencyMeasure);

    expect(page.summaryListValues).toEqual([
      [
        'Do you want, optionally, to report a reduction in energy consumption for the period between 6 December 2025 and 5 December 2026?',
        'Yes',
      ],
      ['Reduction in energy consumption between 6 December 2025 and 5 December 2026', '1111 kWh'],
      ['Estimation method', 'Other estimation method  GG other method'],
      ['Provide context (optional)', 'CTX PU2 M4'],
    ]);
  });
});
