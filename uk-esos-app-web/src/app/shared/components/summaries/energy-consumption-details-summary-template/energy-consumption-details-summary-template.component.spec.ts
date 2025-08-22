import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@testing';

import { EnergyConsumptionDetailsSummaryTemplateComponent } from './energy-consumption-details-summary-template.component';

describe('EnergyConsumptionDetailsSummaryTemplateComponent', () => {
  let component: EnergyConsumptionDetailsSummaryTemplateComponent;
  let fixture: ComponentFixture<EnergyConsumptionDetailsSummaryTemplateComponent>;
  let page: Page;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<EnergyConsumptionDetailsSummaryTemplateComponent> {
    get summaries() {
      return this.queryAll<HTMLDListElement>('dl dt, dl dd').map((dd) => dd.textContent.trim());
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: route }],
    });

    fixture = TestBed.createComponent(EnergyConsumptionDetailsSummaryTemplateComponent);

    component = fixture.componentInstance;
    component.isEditable = true;
    component.energyConsumption = {
      buildings: 0,
      transport: 0,
      industrialProcesses: 0,
      otherProcesses: 0,
      total: 0,
    };

    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all fields', () => {
    expect(page.summaries).toEqual([
      'Buildings',
      '0 kWh',
      'Change',
      'Transport',
      '0 kWh',
      'Change',
      'Industrial processes',
      '0 kWh',
      'Change',
      'Other energy uses',
      '0 kWh',
      'Change',
      'Total',
      '0 kWh',
    ]);
  });
});
