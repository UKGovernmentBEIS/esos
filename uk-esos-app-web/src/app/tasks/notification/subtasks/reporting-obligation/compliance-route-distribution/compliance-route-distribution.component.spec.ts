import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { ActivatedRouteStub } from '@testing';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { RequestTaskItemDTO } from 'esos-api';

import { ComplianceRouteDistributionComponent } from './compliance-route-distribution.component';

/* eslint-disable @typescript-eslint/no-empty-function */
describe('ComplianceRouteDistributionComponent', () => {
  let component: ComplianceRouteDistributionComponent;
  let fixture: ComponentFixture<ComplianceRouteDistributionComponent>;
  let store: RequestTaskStore;

  const user = userEvent.setup();
  const route = new ActivatedRouteStub();
  const taskService = {
    saveSubtask: () => {},
    payload: { noc: { reportingObligation: { reportingObligationDetails: {} } } },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ComplianceRouteDistributionComponent],
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: ActivatedRoute, useValue: route },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setIsEditable(true);
    store.setRequestTaskItem({
      requestTask: { payload: { noc: {} } },
    } as Partial<RequestTaskItemDTO>);

    fixture = TestBed.createComponent(ComplianceRouteDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show fields', () => {
    expect(iso50001Pct()).toBeVisible();
    expect(displayEnergyCertificatePct()).toBeVisible();
    expect(greenDealAssessmentPct()).toBeVisible();
    expect(energyAuditsPct()).toBeVisible();
    expect(energyNotAuditedPct()).toBeVisible();
    expect(totalPct()).toBeVisible();
  });

  it('should show errors when total < 100%', async () => {
    await user.click(submitBtn());
    fixture.detectChanges();

    expect(screen.getByRole('alert')).toBeVisible();
    expect(screen.getAllByText(/The sum of the individual percentages should equate to 100 percent/)).toHaveLength(1);
  });

  it('should save subtask when reason provided', async () => {
    const submitSpy = jest.spyOn(taskService, 'saveSubtask');
    await user.type(iso50001Pct(), '25');
    await user.type(displayEnergyCertificatePct(), '25');
    await user.type(greenDealAssessmentPct(), '25');
    await user.type(energyAuditsPct(), '25');
    fixture.detectChanges();

    expect(totalPct().innerHTML).toEqual('100%');

    await user.click(submitBtn());
    fixture.detectChanges();

    expect(submitSpy).toHaveBeenCalledWith({
      subtask: 'reportingObligation',
      currentStep: 'complianceRouteDistribution',
      payload: {
        noc: {
          reportingObligation: {
            reportingObligationDetails: {
              complianceRouteDistribution: {
                iso50001Pct: 25,
                displayEnergyCertificatePct: 25,
                greenDealAssessmentPct: 25,
                energyAuditsPct: 25,
                totalPct: 100,
                energyNotAuditedPct: 0,
              },
            },
          },
        },
      },
      route,
      applySideEffects: false,
    });
  });

  function submitBtn() {
    return screen.getByRole('button', { name: 'Save and continue' });
  }

  function iso50001Pct() {
    return screen.getByLabelText(/ISO 50001/);
  }

  function displayEnergyCertificatePct() {
    return screen.getByLabelText(/Display Energy Certificate/);
  }

  function greenDealAssessmentPct() {
    return screen.getByLabelText(/Green Deal Assessment/);
  }

  function energyAuditsPct() {
    return screen.getByLabelText(/Energy audits that are compliant with ESOS/);
  }

  function energyNotAuditedPct() {
    return screen.getByLabelText(/covered by any compliance route/);
  }

  function totalPct() {
    return screen.getByTitle(/total/);
  }
});
