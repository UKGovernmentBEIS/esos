import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import {
  mockProgressUpdate2P3AddedMeasures,
  mockProgressUpdate2P3Measure1,
  mockProgressUpdate2P3Measures,
  mockProgressUpdate2P3UpdatedAddedMeasure1,
} from '@tasks/progress-update-2/testing/mock-data';
import { BasePage } from '@testing';
import { screen } from '@testing-library/angular';

import {
  ProgressUpdate2P3AddedMeasure,
  ProgressUpdate2P3UpdatedAddedMeasure,
  ProgressUpdate2P3UpdatedMeasure,
} from 'esos-api';

import { ProgressUpdate2EnergyEfficiencyMeasuresSummaryPageComponent } from './pu2-energy-efficiency-measures-summary-page.component';

describe('ProgressUpdate2EnergyEfficiencyMeasuresSummaryPageComponent', () => {
  let component: ProgressUpdate2EnergyEfficiencyMeasuresSummaryPageComponent;
  let fixture: ComponentFixture<ProgressUpdate2EnergyEfficiencyMeasuresSummaryPageComponent>;
  let page: Page;

  class Page extends BasePage<ProgressUpdate2EnergyEfficiencyMeasuresSummaryPageComponent> {
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
    return screen.queryByText('Update for action plan and progress update 1 measures', { exact: true }) ?? null;
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
    mockProgressUpdate2P3UpdatedMeasure: (ProgressUpdate2P3UpdatedMeasure | ProgressUpdate2P3UpdatedAddedMeasure)[],
    mockProgressUpdate2P3AddedMeasure: ProgressUpdate2P3AddedMeasure[],
    isEditable = false,
  ) {
    TestBed.configureTestingModule({
      imports: [ProgressUpdate2EnergyEfficiencyMeasuresSummaryPageComponent, RouterModule.forRoot([])],
    });
    fixture = TestBed.createComponent(ProgressUpdate2EnergyEfficiencyMeasuresSummaryPageComponent);
    component = fixture.componentInstance;
    component.measuresForUpdate = mockProgressUpdate2P3UpdatedMeasure;
    component.addedMeasures = mockProgressUpdate2P3AddedMeasure;
    component.isEditable = isEditable;
    page = new Page(fixture);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent(mockProgressUpdate2P3Measures, mockProgressUpdate2P3AddedMeasures);
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
    createComponent([mockProgressUpdate2P3Measure1], [], true);

    expect(page.summaryListValues).toEqual([
      // AP details
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
      // PU1 details
      [
        'Do you want, optionally, to report a reduction in energy consumption for the period between 6 December 2024 and 5 December 2025?',
        'No',
      ],
      [
        'Do you want, optionally, to report a reduction in energy consumption between 6 December 2023 and 5 December 2024?',
        'No',
      ],
      ['Provide context (optional)', 'CTX1'],
      // PU2
      [
        'Do you want, optionally, to report a reduction in energy consumption for the period between 6 December 2025 and 5 December 2026?',
        'No',
        'Change',
      ],
      ['Provide context (optional)', 'CTX1', 'Change'],
    ]);
    expect(changeLinks().length).toBe(2);
    expect(updateForMeasuresTitle()).toBeVisible();
    expect(page.updateForMeasureCards.length).toBe(1);

    expect(addedMeasuresTitle()).toBeTruthy();
    expect(page.addedMeasureCards.length).toBe(0);
  });

  it('for PU1 added measure should show updates for measures cards and no new measures added', () => {
    createComponent([mockProgressUpdate2P3UpdatedAddedMeasure1], [], true);

    expect(page.summaryListValues).toEqual([
      // PU1 details
      ['Reduction in energy consumption between 6 December 2024 and 5 December 2025', '1 kWh'],
      ['Estimation method', 'Energy audit'],
      ['Provide context (optional)', ''],
      // PU2
      [
        'Do you want, optionally, to report a reduction in energy consumption for the period between 6 December 2025 and 5 December 2026?',
        'Yes',
        'Change',
      ],
      ['Reduction in energy consumption between 6 December 2025 and 5 December 2026', '313 kWh', 'Change'],
      ['Provide context (optional)', 'CTX: PU2 for PU1 Added M1', 'Change'],
    ]);
    expect(changeLinks().length).toBe(3);
    expect(updateForMeasuresTitle()).toBeVisible();
    expect(page.updateForMeasureCards.length).toBe(1);

    expect(addedMeasuresTitle()).toBeTruthy();
    expect(page.addedMeasureCards.length).toBe(0);
  });

  it('should show new measures added and no updates for action plan measures', () => {
    createComponent([], mockProgressUpdate2P3AddedMeasures, true);

    expect(page.summaryListValues).toEqual([
      [
        'Does the reason for implementing the measure relate to another scheme or requirement? Select any that apply. (optional)',
        '',
      ],
      ['Reduction in energy consumption between 6 December 2025 and 5 December 2026', '12 kWh'],
      ['Estimation method', 'No estimation method used'],
      ['Provide context to the measure (optional)', ''],
      [
        'Does the reason for implementing the measure relate to another scheme or requirement? Select any that apply. (optional)',
        'Climate Change Agreements (CCAs)  Streamlined Energy and Carbon Reporting (SECR)  UK Emissions Trading Scheme (ETS)  UN Race to Zero  Science-Based Targets Initiative (SBTi)  Carbon Reduction Plans (required in the procurement of major Government contracts)  Other: Other6',
      ],
      ['Reduction in energy consumption between 6 December 2025 and 5 December 2026', '232 kWh'],
      ['Estimation method', 'Other estimation method  Another reasonable method'],
      ['Provide context to the measure (optional)', 'AA'],
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
    createComponent(mockProgressUpdate2P3Measures, mockProgressUpdate2P3AddedMeasures, false);

    expect(changeLinks().length).toBe(0);
    expect(editLinks().length).toBe(0);
    expect(removeLinks().length).toBe(0);
    expect(page.updateForMeasureCards.length).toBe(4);
    expect(page.addedMeasureCards.length).toBe(2);
  });
});
