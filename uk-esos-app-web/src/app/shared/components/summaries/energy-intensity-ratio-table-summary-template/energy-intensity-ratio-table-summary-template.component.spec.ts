import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@testing';

import { EnergyIntensityRatioTableSummaryTemplateComponent } from './energy-intensity-ratio-table-summary-template.component';

describe('EnergyIntensityRatioTableSummaryTemplateComponent', () => {
  let component: EnergyIntensityRatioTableSummaryTemplateComponent;
  let fixture: ComponentFixture<EnergyIntensityRatioTableSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<EnergyIntensityRatioTableSummaryTemplateComponent> {
    get summaryListValues() {
      return this.queryAll<HTMLDivElement>('.govuk-summary-list__row')
        .map((row) => [
          ...(Array.from(row.querySelectorAll('dt')) ?? []),
          ...(Array.from(row.querySelectorAll('dd')) ?? []),
        ])
        .map((pair) => pair.map((element) => element?.textContent?.trim()));
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EnergyIntensityRatioTableSummaryTemplateComponent],
    });
    fixture = TestBed.createComponent(EnergyIntensityRatioTableSummaryTemplateComponent);
    component = fixture.componentInstance;

    component.energyIntensityRatioDetails = {
      energyIntensityRatios: [{ ratio: '50', unit: 'm2' }],
      additionalInformation: 'Buildings additional information',
    };

    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the additional information data', () => {
    expect(page.summaryListValues).toEqual([['Additional Information', 'Buildings additional information']]);
  });
});
