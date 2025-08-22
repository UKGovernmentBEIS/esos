import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { EnergyEfficiencyMeasuresSummaryPageComponent } from '@shared/components/summaries';
import { mockActionPlanEnergyEfficiencyMeasure } from '@tasks/action-plan/testing/mock-data';
import { BasePage } from '@testing';
import { screen } from '@testing-library/angular';

import { ActionPlanEnergyEfficiencyMeasure } from 'esos-api';

describe('EnergyEfficiencyMeasuresSummaryPageComponent', () => {
  let component: EnergyEfficiencyMeasuresSummaryPageComponent;
  let fixture: ComponentFixture<EnergyEfficiencyMeasuresSummaryPageComponent>;
  let page: Page;

  class Page extends BasePage<EnergyEfficiencyMeasuresSummaryPageComponent> {
    get measureCards() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-card');
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

  function measuresTitle() {
    return screen.queryByText('Energy efficiency measures added', { exact: true }) ?? null;
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

  function createComponent(mockData: ActionPlanEnergyEfficiencyMeasure, isEditable = false) {
    TestBed.configureTestingModule({
      imports: [EnergyEfficiencyMeasuresSummaryPageComponent, RouterModule.forRoot([])],
    });
    fixture = TestBed.createComponent(EnergyEfficiencyMeasuresSummaryPageComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    component.isEditable = isEditable;
    page = new Page(fixture);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent(mockActionPlanEnergyEfficiencyMeasure);
    expect(component).toBeTruthy();
  });

  it('should show change links for the inital question and not show measure cards', () => {
    createComponent({ haveEnergyEfficiencyMeasures: false, noMeasureContext: 'Sed ut perspiciatis' }, true);

    expect(page.summaryListValues).toEqual([
      [
        'Do you have any energy efficiency measures proposed to be implemented before the end of the relevant compliance period?',
        'No',
        'Change',
      ],
      ['Provide context (optional)', 'Sed ut perspiciatis', 'Change'],
    ]);
    expect(changeLinks().length).toBe(2);
    expect(measuresTitle()).toBeFalsy();
    expect(page.measureCards.length).toBe(0);
  });

  it('when isEditable is false, should not show change, edit nor remove links', () => {
    createComponent(mockActionPlanEnergyEfficiencyMeasure, false);

    expect(changeLinks().length).toBe(0);
    expect(editLinks().length).toBe(0);
    expect(removeLinks().length).toBe(0);
    expect(page.measureCards.length).toBe(2);
  });

  it('should show 2 measure cards and match summary values', () => {
    createComponent(mockActionPlanEnergyEfficiencyMeasure, true);

    expect(changeLinks().length).toBe(1);
    expect(editLinks().length).toBe(2);
    expect(removeLinks().length).toBe(2);
    expect(page.measureCards.length).toBe(2);
    expect(measuresTitle()).toBeVisible();
    expect(page.summaryListValues).toEqual([
      [
        'Do you have any energy efficiency measures proposed to be implemented before the end of the relevant compliance period?',
        'Yes',
        'Change',
      ],
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
