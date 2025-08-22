import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@testing';

import { EnergySavingsCategoriesSummaryTemplateComponent } from './energy-savings-categories-summary-template.component';

describe('EnergySavingsCategoriesSummaryTemplateComponent', () => {
  let component: EnergySavingsCategoriesSummaryTemplateComponent;
  let fixture: ComponentFixture<EnergySavingsCategoriesSummaryTemplateComponent>;
  let page: Page;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<EnergySavingsCategoriesSummaryTemplateComponent> {
    get summaries() {
      return this.queryAll<HTMLDListElement>('dl dt, dl dd').map((dd) => dd.textContent.trim());
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: route }],
    });

    fixture = TestBed.createComponent(EnergySavingsCategoriesSummaryTemplateComponent);

    component = fixture.componentInstance;
    component.isEditable = true;
    component.energySavingCategoriesExist = 'YES';
    component.energySavingsCategories = {
      energyManagementPractices: 0,
      behaviourChangeInterventions: 0,
      training: 0,
      controlsImprovements: 0,
      capitalInvestments: 0,
      otherMeasures: 0,
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
      'Yes',
      'Change',
      'Energy management practices',
      '0 kWh',
      'Change',
      'Behaviour change interventions',
      '0 kWh',
      'Change',
      'Training',
      '0 kWh',
      'Change',
      'Controls improvements',
      '0 kWh',
      'Change',
      'Capital investments',
      '0 kWh',
      'Change',
      'Other measures not covered by one of the above',
      '0 kWh',
      'Change',
      'Total',
      '0   kWh',
    ]);
  });
});
