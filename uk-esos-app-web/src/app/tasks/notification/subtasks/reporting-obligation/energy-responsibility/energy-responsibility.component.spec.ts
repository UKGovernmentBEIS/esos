import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { ActivatedRouteStub } from '@testing';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { RequestTaskItemDTO } from 'esos-api';

import { EnergyResponsibilityComponent } from './energy-responsibility.component';

/* eslint-disable @typescript-eslint/no-empty-function */
describe('EnergyResponsibilityComponent', () => {
  let component: EnergyResponsibilityComponent;
  let fixture: ComponentFixture<EnergyResponsibilityComponent>;
  let store: RequestTaskStore;

  const user = userEvent.setup();
  const route = new ActivatedRouteStub();
  const taskService = {
    saveSubtask: () => {},
    payload: { noc: { reportingObligation: { reportingObligationDetails: {} } } },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EnergyResponsibilityComponent],
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

    fixture = TestBed.createComponent(EnergyResponsibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show radio buttons', () => {
    expect(yesRadio()).toBeVisible();
    expect(noRadio()).toBeVisible();
    expect(lessThan40kRadio()).toBeVisible();
  });

  it('should show errors when no selection', async () => {
    await user.click(submitBtn());
    fixture.detectChanges();

    expect(screen.getByRole('alert')).toBeVisible();
    expect(screen.getAllByText(/Select an option/)).toHaveLength(2);
  });

  it('should save subtask when option selected', async () => {
    const submitSpy = jest.spyOn(taskService, 'saveSubtask');
    await user.click(yesRadio());
    fixture.detectChanges();

    await user.click(submitBtn());
    fixture.detectChanges();

    expect(submitSpy).toHaveBeenCalledWith({
      subtask: 'reportingObligation',
      currentStep: 'energyResponsibility',
      payload: {
        noc: {
          reportingObligation: {
            reportingObligationDetails: {
              energyResponsibilityType: 'RESPONSIBLE',
            },
          },
        },
      },
      route,
      applySideEffects: false,
    });
  });

  function yesRadio() {
    return screen.getByRole('radio', { name: /and at least 40,000 kWh of energy was used in the reference period$/ });
  }

  function noRadio() {
    return screen.getByRole('radio', { name: /there is no energy responsibility/ });
  }

  function lessThan40kRadio() {
    return screen.getByRole('radio', { name: /but less than 40,000 kWh of energy was used in the reference period/ });
  }

  function submitBtn() {
    return screen.getByRole('button', { name: 'Save and continue' });
  }
});
