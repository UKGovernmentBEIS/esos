import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { mockEnergyEfficiencyMeasure1, mockEnergyEfficiencyMeasure2 } from '@tasks/action-plan/testing/mock-data';
import { BasePage } from '@testing';

import { EnergyEfficiencyMeasure } from 'esos-api';

import { EnergyEfficiencyMeasureSummaryListTemplateComponent } from './energy-efficiency-measure-summary-list-template.component';

describe('EnergyEfficiencyMeasureSummaryListTemplateComponent', () => {
  let component: EnergyEfficiencyMeasureSummaryListTemplateComponent;
  let fixture: ComponentFixture<EnergyEfficiencyMeasureSummaryListTemplateComponent>;
  let page: Page;

  class Page extends BasePage<EnergyEfficiencyMeasureSummaryListTemplateComponent> {
    get summaryListValues() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__row')
        .map((row) => [
          ...(Array.from(row.querySelectorAll('dt')) ?? []),
          ...(Array.from(row.querySelectorAll('dd')) ?? []),
        ])
        .map((pair) => pair.map((element) => element?.textContent?.trim()));
    }
  }

  function createComponent(mockData: EnergyEfficiencyMeasure) {
    TestBed.configureTestingModule({
      imports: [EnergyEfficiencyMeasureSummaryListTemplateComponent, RouterModule.forRoot([])],
    });

    fixture = TestBed.createComponent(EnergyEfficiencyMeasureSummaryListTemplateComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    page = new Page(fixture);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent(mockEnergyEfficiencyMeasure1);
    expect(component).toBeTruthy();
  });

  it('should show summary values for mockEnergyEfficiencyMeasure1', () => {
    createComponent(mockEnergyEfficiencyMeasure1);

    expect(page.summaryListValues).toEqual([
      ['Is this measure a result of an energy savings opportunity reported in an energy audit?', 'Yes'],
      [
        'Does the reason for implementing the measure relate to another scheme or requirement? Select any that apply. (optional)',
        'Climate Change Agreements (CCAs)  Streamlined Energy and Carbon Reporting (SECR)  Other: The other measure scheme name',
      ],
      ['Implementation date for the measure', 'April 2025'],
      [
        'Estimated energy savings between 6 December 2023 and 5 December 2027',
        'Buildings: 65856 kWh Transport: 0 kWh Industrial processes: 0 kWh Other energy uses: 0 kWh Total estimated energy savings: 65856 kWh',
      ],
      ['How was the total energy savings estimate calculated?', 'Energy audit'],
      ['Provide context to the measure (optional)', 'Ab ovo'],
    ]);
  });

  it('should show summary values for mockEnergyEfficiencyMeasure2', () => {
    createComponent(mockEnergyEfficiencyMeasure2);

    expect(page.summaryListValues).toEqual([
      ['Is this measure a result of an energy savings opportunity reported in an energy audit?', 'No'],
      [
        'Does the reason for implementing the measure relate to another scheme or requirement? Select any that apply. (optional)',
        '',
      ],
      ['Implementation date for the measure', 'March 2027'],
      [
        'Estimated energy savings between 6 December 2023 and 5 December 2027',
        'Buildings: 1 kWh Transport: 2 kWh Industrial processes: 3 kWh Other energy uses: 4 kWh Total estimated energy savings: 10 kWh',
      ],
      [
        'How was the total energy savings estimate calculated?',
        'Other estimation method  Sed ut perspiciatis unde omnis iste natus',
      ],
      ['Provide context to the measure (optional)', 'Illum qui dolorem eum fugiat quo voluptas nulla pariatur'],
    ]);
  });
});
