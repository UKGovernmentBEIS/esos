import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TotalEnergyConsumptionReductionSummaryTemplateComponent } from '@shared/components/summaries';
import { ActivatedRouteStub } from '@testing';

describe('TotalEnergyConsumptionReductionSummaryTemplateComponent', () => {
  let component: TotalEnergyConsumptionReductionSummaryTemplateComponent;
  let fixture: ComponentFixture<TotalEnergyConsumptionReductionSummaryTemplateComponent>;

  const route = new ActivatedRouteStub();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: route }],
    });
    fixture = TestBed.createComponent(TotalEnergyConsumptionReductionSummaryTemplateComponent);
    component = fixture.componentInstance;
    component.isEditable = true;
    component.totalEnergyConsumptionReduction = { energyConsumption: 10, energyCost: null };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    const cells = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('td'));

    expect(cells.map((cell) => cell.textContent.trim())).toEqual([
      ...['Total annual reduction', '10', 'No data entered', 'Change'],
    ]);
  });
});
