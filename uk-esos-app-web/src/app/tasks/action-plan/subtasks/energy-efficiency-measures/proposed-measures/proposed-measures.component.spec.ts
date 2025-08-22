import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { ActivatedRouteStub } from '@testing';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { RequestTaskItemDTO } from 'esos-api';

import {
  ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
  EnergyEfficiencyMeasuresStep,
} from '../energy-efficiency-measures.helper';
import { ProposedMeasuresComponent } from './proposed-measures.component';
import { PROPOSED_MEASURES_CONTENT } from './proposed-measures-content';

describe('ProposedMeasuresComponent', () => {
  let component: ProposedMeasuresComponent;
  let fixture: ComponentFixture<ProposedMeasuresComponent>;
  let store: RequestTaskStore;

  const user = userEvent.setup();
  const route = new ActivatedRouteStub();
  const taskService = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    saveSubtask: () => {},
    payload: {},
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProposedMeasuresComponent],
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: ActivatedRoute, useValue: route },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setIsEditable(true);
    store.setRequestTaskItem({
      requestTask: { payload: { actionPlanP3: {} } },
    } as Partial<RequestTaskItemDTO>);

    fixture = TestBed.createComponent(ProposedMeasuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show yes/no radio buttons', () => {
    expect(yesRadio()).toBeVisible();
    expect(noRadio()).toBeVisible();
  });

  it('should show errors when no selection', async () => {
    await user.click(submitBtn());
    fixture.detectChanges();

    expect(screen.getByRole('alert')).toBeVisible();
    expect(screen.getAllByText(/Select yes if you have any/)).toHaveLength(2);
  });

  it('should show conditional textarea when "No" selected', async () => {
    await user.click(noRadio());
    fixture.detectChanges();

    expect(noMeasureContextTextarea()).toBeVisible();
  });

  it('should save subtask when "No" option selected', async () => {
    const submitSpy = jest.spyOn(taskService, 'saveSubtask');
    await user.click(noRadio());
    fixture.detectChanges();

    await user.type(noMeasureContextTextarea(), 'Lorem ipsum');
    fixture.detectChanges();

    await user.click(submitBtn());
    fixture.detectChanges();

    expect(submitSpy).toHaveBeenCalledWith({
      subtask: ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
      currentStep: EnergyEfficiencyMeasuresStep.PROPOSED_MEASURES,
      payload: {
        actionPlanP3: {
          energyEfficiencyMeasure: { haveEnergyEfficiencyMeasures: false, noMeasureContext: 'Lorem ipsum' },
        },
      },
      route,
      applySideEffects: true,
    });
  });

  it('should save subtask when "Yes" option selected', async () => {
    const submitSpy = jest.spyOn(taskService, 'saveSubtask');
    await user.click(yesRadio());
    fixture.detectChanges();

    await user.click(submitBtn());
    fixture.detectChanges();

    expect(submitSpy).toHaveBeenCalledWith({
      subtask: ENERGY_EFFICIENCY_MEASURES_SUBTASK_NAME,
      currentStep: EnergyEfficiencyMeasuresStep.PROPOSED_MEASURES,
      payload: {
        actionPlanP3: {
          energyEfficiencyMeasure: { haveEnergyEfficiencyMeasures: true },
        },
      },
      route,
      applySideEffects: true,
    });
  });

  function yesRadio() {
    return screen.getByRole('radio', { name: 'Yes' });
  }

  function noRadio() {
    return screen.getByRole('radio', { name: 'No' });
  }

  function noMeasureContextTextarea() {
    return screen.getByRole('textbox', { name: PROPOSED_MEASURES_CONTENT.noMeasureContextLabel });
  }

  function submitBtn() {
    return screen.getByRole('button', { name: 'Save and continue' });
  }
});
