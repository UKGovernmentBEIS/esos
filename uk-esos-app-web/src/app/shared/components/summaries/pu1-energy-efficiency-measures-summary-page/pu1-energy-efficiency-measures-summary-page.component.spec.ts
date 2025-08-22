import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import {
  mockProgressUpdate1P3Measure1,
  mockProgressUpdate1P3Measures,
  progressUpdate1P3AddedMeasures,
} from '@tasks/progress-update-1/testing/mock-data';
import { BasePage } from '@testing';
import { screen } from '@testing-library/angular';

import { ProgressUpdate1P3AddedMeasure, ProgressUpdate1P3UpdatedMeasure } from 'esos-api';

import { ProgressUpdate1EnergyEfficiencyMeasuresSummaryPageComponent } from './pu1-energy-efficiency-measures-summary-page.component';

describe('ProgressUpdate1EnergyEfficiencyMeasuresSummaryPageComponent', () => {
  let component: ProgressUpdate1EnergyEfficiencyMeasuresSummaryPageComponent;
  let fixture: ComponentFixture<ProgressUpdate1EnergyEfficiencyMeasuresSummaryPageComponent>;
  let page: Page;

  class Page extends BasePage<ProgressUpdate1EnergyEfficiencyMeasuresSummaryPageComponent> {
    get updateForMeasureCards() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-card--update');
    }

    get addedMeasureCards() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-card--added');
    }

    get summaryListValues() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__row')
        .map((row) => [
          ...(Array.from(row.querySelectorAll('dt')) ?? []),
          ...(Array.from(row.querySelectorAll('dd')) ?? []),
        ])
        .map((pair) => pair.map((element) => element?.textContent?.trim()));
    }
  }

  function updateForMeasuresTitle() {
    return screen.queryByText('Progress update for action plan measures', { exact: true }) ?? null;
  }

  function addedMeasuresTitle() {
    return screen.queryByText('New measures', { exact: true }) ?? null;
  }

  function changeLinks() {
    return screen.queryAllByText('Change', { exact: true });
  }

  function editLinks() {
    return screen.queryAllByText('Edit', { exact: true });
  }

  function removeLinks() {
    return screen.queryAllByText('Edit', { exact: true });
  }

  function createComponent(
    mockProgressUpdate1P3UpdatedMeasures: ProgressUpdate1P3UpdatedMeasure[],
    mockProgressUpdate1P3AddedMeasures: ProgressUpdate1P3AddedMeasure[],
    isEditable = false,
  ) {
    TestBed.configureTestingModule({
      imports: [ProgressUpdate1EnergyEfficiencyMeasuresSummaryPageComponent, RouterModule.forRoot([])],
    });
    fixture = TestBed.createComponent(ProgressUpdate1EnergyEfficiencyMeasuresSummaryPageComponent);
    component = fixture.componentInstance;
    component.measuresForUpdate = mockProgressUpdate1P3UpdatedMeasures;
    component.addedMeasures = mockProgressUpdate1P3AddedMeasures;
    component.isEditable = isEditable;
    page = new Page(fixture);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent(mockProgressUpdate1P3Measures, progressUpdate1P3AddedMeasures);
    expect(component).toBeTruthy();
  });

  it('should not show measure cards for an empty action plan and no new measures added', () => {
    createComponent([], [], true);

    expect(changeLinks().length).toBe(0);
    expect(updateForMeasuresTitle()).toBeFalsy();
    expect(page.updateForMeasureCards.length).toBe(0);

    expect(addedMeasuresTitle()).toBeTruthy();
    expect(page.addedMeasureCards.length).toBe(0);
  });

  it('should show updates for measures cards and no new measures added', () => {
    createComponent([mockProgressUpdate1P3Measure1], [], true);

    expect(page.summaryListValues).toEqual([
      ['Is this measure a result of an energy savings opportunity reported in an energy audit?', 'Yes'],
      [
        'Does the reason for implementing the measure relate to another scheme or requirement? Select any that apply. (optional)',
        'Climate Change Agreements (CCAs)  Streamlined Energy and Carbon Reporting (SECR)  UK Emissions Trading Scheme (ETS)  UN Race to Zero  Science-Based Targets Initiative (SBTi)  Carbon Reduction Plans (required in the procurement of major Government contracts)  Other: Other6 lipsum',
      ],
      ['Implementation date for the measure', 'October 2024'],
      [
        'Estimated energy savings between 6 December 2023 and 5 December 2027',
        'Buildings: 233 kWh Transport: 0 kWh Industrial processes: 3232 kWh Other energy uses: 0 kWh Total estimated energy savings: 3465 kWh',
      ],
      ['How was the total energy savings estimate calculated?', 'Alternative compliance method'],
      ['Provide context to the measure (optional)', 'Kontekst'],
      [
        'Do you want, optionally, to report a reduction in energy consumption for the period between 6 December 2024 and 5 December 2025?',
        'No',
        'Change',
      ],
      [
        'Do you want, optionally, to report a reduction in energy consumption between 6 December 2023 and 5 December 2024?',
        'No',
        'Change',
      ],
      ['Provide context (optional)', 'CTX1', 'Change'],
    ]);
    expect(changeLinks().length).toBe(3);
    expect(updateForMeasuresTitle()).toBeVisible();
    expect(page.updateForMeasureCards.length).toBe(1);

    expect(addedMeasuresTitle()).toBeTruthy();
    expect(page.addedMeasureCards.length).toBe(0);
  });

  it('should show new measures added and no updates for action plan measures', () => {
    createComponent([], progressUpdate1P3AddedMeasures, true);

    expect(page.summaryListValues).toEqual([
      [
        'Does the reason for implementing the measure relate to another scheme or requirement? Select any that apply. (optional)',
        '',
      ],
      ['Reduction in energy consumption between 6 December 2024 and 5 December 2025', '1 kWh'],
      ['Reduction in energy consumption between 6 December 2023 and 5 December 2024 (optional)', ''],
      ['Estimation method', 'Energy audit'],
      ['Provide context to the measure (optional)', ''],
      [
        'Does the reason for implementing the measure relate to another scheme or requirement? Select any that apply. (optional)',
        'Climate Change Agreements (CCAs)  Streamlined Energy and Carbon Reporting (SECR)  UK Emissions Trading Scheme (ETS)  UN Race to Zero  Science-Based Targets Initiative (SBTi)  Carbon Reduction Plans (required in the procurement of major Government contracts)  Other: Other6',
      ],
      ['Reduction in energy consumption between 6 December 2024 and 5 December 2025', '123 kWh'],
      ['Reduction in energy consumption between 6 December 2023 and 5 December 2024 (optional)', '456 kWh'],
      ['Estimation method', 'Energy audit'],
      ['Provide context to the measure (optional)', 'GG'],
    ]);
    expect(changeLinks().length).toBe(0);
    expect(editLinks().length).toBe(2);
    expect(removeLinks().length).toBe(2);

    expect(updateForMeasuresTitle()).toBeFalsy();
    expect(addedMeasuresTitle()).toBeVisible();
    expect(page.updateForMeasureCards.length).toBe(0);
    expect(page.addedMeasureCards.length).toBe(2);
  });

  it('when isEditable is false, should not show change, edit nor remove links', () => {
    createComponent(mockProgressUpdate1P3Measures, progressUpdate1P3AddedMeasures, false);

    expect(changeLinks().length).toBe(0);
    expect(editLinks().length).toBe(0);
    expect(removeLinks().length).toBe(0);
    expect(page.updateForMeasureCards.length).toBe(4);
    expect(page.addedMeasureCards.length).toBe(2);
  });
});
