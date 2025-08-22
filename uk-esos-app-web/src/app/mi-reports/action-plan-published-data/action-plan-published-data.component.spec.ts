import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { asyncData, mockClass } from '@testing';

import { MiReportsService } from 'esos-api';

import { ActionPlanPublishedDataComponent } from './action-plan-published-data.component';
import { ActionPlanPublishedDataService } from './action-plan-published-data.service';
import { mockActionPlanPublishedDataResult } from './action-plan-published-mock-data';

describe('ActionPlanPublishedDataComponent', () => {
  let component: ActionPlanPublishedDataComponent;
  let fixture: ComponentFixture<ActionPlanPublishedDataComponent>;

  const miReportsService = {
    generateReport: jest.fn().mockReturnValue(asyncData(mockActionPlanPublishedDataResult)),
  };
  const actionPlanPublishedDataService = mockClass(ActionPlanPublishedDataService);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: MiReportsService, useValue: miReportsService },
        { provide: ActionPlanPublishedDataService, useValue: actionPlanPublishedDataService },
      ],
    });
    fixture = TestBed.createComponent(ActionPlanPublishedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title and button', () => {
    expect(fixture.nativeElement.querySelector('esos-page-heading').textContent).toContain(
      'Action Plan Published Data - Phase 3',
    );
    expect(fixture.nativeElement.querySelector('button').textContent).toContain('Export to excel');
  });

  it('should export when button clicked', () => {
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(miReportsService.generateReport).toHaveBeenCalledTimes(1);
    expect(actionPlanPublishedDataService.exportToExcel).toHaveBeenCalledTimes(1);
  });
});
