import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { EnergySavingsCategories } from 'esos-api';

import { EnergySavingCategoriesDetailsSummaryTemplateComponent } from './energy-saving-categories-details-summary-template.component';

describe('EnergySavingCategoriesDetailsSummaryTemplateComponent', () => {
  let component: EnergySavingCategoriesDetailsSummaryTemplateComponent;
  let fixture: ComponentFixture<TestComponent>;
  let hostComponent: TestComponent;

  const energySavingsCategoriesDTO: EnergySavingsCategories = {
    energyManagementPractices: 1,
    behaviourChangeInterventions: 2,
    training: 3,
    controlsImprovements: 4,
    capitalInvestments: 5,
    otherMeasures: 7,
    total: 28,
  };

  @Component({
    template:
      '<esos-energy-saving-categories-details-summary-template [energySavingsCategories]="data"></esos-energy-saving-categories-details-summary-template>',
    standalone: true,
    imports: [EnergySavingCategoriesDetailsSummaryTemplateComponent],
  })
  class TestComponent {
    data: EnergySavingsCategories;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TestComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
    hostComponent = fixture.componentInstance;
    hostComponent.data = energySavingsCategoriesDTO;
    component = fixture.debugElement.query(
      By.directive(EnergySavingCategoriesDetailsSummaryTemplateComponent),
    ).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display energy saving categories details correctly', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement;

    expect(compiled.textContent).toContain('Energy management practices');
    expect(compiled.textContent).toContain('Behaviour change interventions');
    expect(compiled.textContent).toContain('Training');
    expect(compiled.textContent).toContain('Controls improvements');
    expect(compiled.textContent).toContain('Capital investments');
    expect(compiled.textContent).toContain('Other measures not covered by one of the above');
  });
});
