import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { ActivatedRouteStub } from '@testing';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { ReportingObligationSummaryComponent } from './reporting-obligation-summary.component';

/* eslint-disable @typescript-eslint/no-empty-function */
describe('ReportingObligationSummaryComponent', () => {
  let component: ReportingObligationSummaryComponent;
  let fixture: ComponentFixture<ReportingObligationSummaryComponent>;
  let store: RequestTaskStore;
  const user = userEvent.setup();

  const taskService = {
    submitSubtask: () => {},
    payload: {},
  };

  const route = new ActivatedRouteStub();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReportingObligationSummaryComponent],
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: ActivatedRoute, useValue: route },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setState({
      isEditable: true,
      requestTaskItem: {
        requestTask: {
          payload: {
            noc: {
              reportingObligation: {
                qualificationType: 'QUALIFY',
                reportingObligationDetails: {
                  qualificationReasonType: 'TURNOVER_MORE_THAN_44M',
                  energyResponsibilityType: 'RESPONSIBLE',
                  complianceRouteDistribution: {
                    iso50001Pct: 25,
                    displayEnergyCertificatePct: 25,
                    greenDealAssessmentPct: 25,
                    energyAuditsPct: 25,
                    energyNotAuditedPct: 0,
                    totalPct: 100,
                  },
                },
              },
            },
            nocSectionsCompleted: {
              reportingObligation: 'IN_PROGRESS',
            },
          },
        },
      },
    } as any);

    fixture = TestBed.createComponent(ReportingObligationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should submit a valid form and navigate to nextRoute`, async () => {
    const taskServiceSpy = jest.spyOn(taskService, 'submitSubtask');
    const submitBtn = screen.getByRole('button', { name: 'Confirm and continue' });
    await user.click(submitBtn);
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'reportingObligation',
      currentStep: 'summary',
      route: route,
      payload: {},
      applySideEffects: true,
    });
  });
});
