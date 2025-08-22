import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import {
  mockProgressUpdate1P3Measure1,
  mockProgressUpdate1P3Measure2,
  mockProgressUpdate1P3Measure3,
  mockProgressUpdate1P3Measure4,
} from '@tasks/progress-update-1/testing/mock-data';
import { BasePage } from '@testing';

import { ProgressUpdate1P3EnergyEfficiencyMeasure } from 'esos-api';

import { ProgressUpdate1UpdateForMeasureSummaryTemplateComponent } from './pu1-update-for-measure-summary-template.component';

describe('ProgressUpdate1UpdateForMeasureSummaryTemplateComponent', () => {
  let component: ProgressUpdate1UpdateForMeasureSummaryTemplateComponent;
  let fixture: ComponentFixture<ProgressUpdate1UpdateForMeasureSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<ProgressUpdate1UpdateForMeasureSummaryTemplateComponent> {
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
      imports: [ProgressUpdate1UpdateForMeasureSummaryTemplateComponent, RouterModule.forRoot([])],
    });

    fixture = TestBed.createComponent(ProgressUpdate1UpdateForMeasureSummaryTemplateComponent);
    component = fixture.componentInstance;
    component.updateForMeasure = mockData;
    page = new Page(fixture);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent(mockProgressUpdate1P3Measure1.progressUpdate1P3EnergyEfficiencyMeasure);
    expect(component).toBeTruthy();
  });

  it('should show summary values for mockProgressUpdate1P3Measure1', () => {
    createComponent(mockProgressUpdate1P3Measure1.progressUpdate1P3EnergyEfficiencyMeasure);

    expect(page.summaryListValues).toEqual([
      [
        'Do you want, optionally, to report a reduction in energy consumption for the period between 6 December 2024 and 5 December 2025?',
        'No',
      ],
      [
        'Do you want, optionally, to report a reduction in energy consumption between 6 December 2023 and 5 December 2024?',
        'No',
      ],
      ['Provide context (optional)', 'CTX1'],
    ]);
  });

  it('should show summary values for mockProgressUpdate1P3Measure2', () => {
    createComponent(mockProgressUpdate1P3Measure2.progressUpdate1P3EnergyEfficiencyMeasure);

    expect(page.summaryListValues).toEqual([
      ['Has the measure been implemented?', 'No'],
      ['Provide context (optional)', ''],
    ]);
  });

  it('should show summary values for mockProgressUpdate1P3Measure3', () => {
    createComponent(mockProgressUpdate1P3Measure3.progressUpdate1P3EnergyEfficiencyMeasure);

    expect(page.summaryListValues).toEqual([
      ['Has the measure been implemented?', 'Yes'],
      ['Was the measure implemented by the date proposed in the action plan?', 'Yes'],
      ['Reduction in energy consumption between 6 December 2024 and 5 December 2025', '11222 kWh'],
      ['Reduction in energy consumption between 6 December 2023 and 5 December 2024', ''],
      ['Estimation method', 'Energy audit'],
      ['Provide context (optional)', ''],
    ]);
  });

  it('should show summary values for mockProgressUpdate1P3Measure4', () => {
    createComponent(mockProgressUpdate1P3Measure4.progressUpdate1P3EnergyEfficiencyMeasure);

    expect(page.summaryListValues).toEqual([
      [
        'Do you want, optionally, to report a reduction in energy consumption for the period between 6 December 2024 and 5 December 2025?',
        'Yes',
      ],
      ['Reduction in energy consumption between 6 December 2024 and 5 December 2025', '23 kWh'],
      [
        'Do you want, optionally, to report a reduction in energy consumption between 6 December 2023 and 5 December 2024?',
        'Yes',
      ],
      ['Reduction in energy consumption between 6 December 2023 and 5 December 2024', '44444 kWh'],
      ['Estimation method', 'Other estimation method  GG other method'],
      ['Provide context (optional)', 'DD context'],
    ]);
  });
});
