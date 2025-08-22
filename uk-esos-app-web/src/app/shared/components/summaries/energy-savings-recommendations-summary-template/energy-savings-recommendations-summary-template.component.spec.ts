import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@testing';

import { EnergySavingsRecommendationsSummaryTemplateComponent } from './energy-savings-recommendations-summary-template.component';

describe('EnergySavingsRecommendationsSummaryTemplateComponent', () => {
  let component: EnergySavingsRecommendationsSummaryTemplateComponent;
  let fixture: ComponentFixture<EnergySavingsRecommendationsSummaryTemplateComponent>;
  let page: Page;

  const route = new ActivatedRouteStub();

  class Page extends BasePage<EnergySavingsRecommendationsSummaryTemplateComponent> {
    get summaries() {
      return this.queryAll<HTMLDListElement>('dl dt, dl dd').map((dd) => dd.textContent.trim());
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: route }],
    });

    fixture = TestBed.createComponent(EnergySavingsRecommendationsSummaryTemplateComponent);

    component = fixture.componentInstance;
    component.isEditable = true;
    component.energySavingsRecommendationsExist = 'YES';
    component.energySavingsRecommendations = {
      energyAudits: 0,
      alternativeComplianceRoutes: 0,
      other: 0,
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
      'Energy audits',
      '0 %',
      'Change',
      'Alternative compliance routes',
      '0 %',
      'Change',
      'Other',
      '0 %',
      'Change',
      'Total',
      '0   %',
    ]);
  });
});
