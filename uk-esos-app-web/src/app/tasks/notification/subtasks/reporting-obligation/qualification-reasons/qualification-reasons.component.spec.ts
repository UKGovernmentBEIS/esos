import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { ActivatedRouteStub } from '@testing';
import { screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { RequestTaskItemDTO } from 'esos-api';

import { QualificationReasonsComponent } from './qualification-reasons.component';

/* eslint-disable @typescript-eslint/no-empty-function */
describe('QualificationReasonsComponent', () => {
  let component: QualificationReasonsComponent;
  let fixture: ComponentFixture<QualificationReasonsComponent>;
  let store: RequestTaskStore;

  const user = userEvent.setup();
  const route = new ActivatedRouteStub();
  const taskService = {
    saveSubtask: () => {},
    payload: {},
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QualificationReasonsComponent],
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

    fixture = TestBed.createComponent(QualificationReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show qualification type fields', () => {
    expect(turnoverMoreThan44mRadio()).toBeVisible();
    expect(staffMembersMoreThan250Radio()).toBeVisible();
    expect(turnoverMoreThan44mAndStaffMembersMoreThan250Radio()).toBeVisible();
    expect(conditionsNotMetRadio()).toBeVisible();
  });

  it('should show errors when no selection', async () => {
    await user.click(submitBtn());
    fixture.detectChanges();

    expect(screen.getByRole('alert')).toBeVisible();
    expect(screen.getAllByText(/Select an option/)).toHaveLength(2);
  });

  function turnoverMoreThan44mRadio() {
    return screen.getByRole('radio', {
      name: 'The annual turnover is over £44 million and annual balance sheet total in excess of £38 million',
    });
  }

  function staffMembersMoreThan250Radio() {
    return screen.getByRole('radio', {
      name: 'The organisation has 250 or more members of staff',
    });
  }

  function turnoverMoreThan44mAndStaffMembersMoreThan250Radio() {
    return screen.getByRole('radio', {
      name: 'The annual turnover is over £44 million and annual balance sheet total in excess of £38 million, and the organisation has 250 or more members of staff',
    });
  }

  function conditionsNotMetRadio() {
    return screen.getByRole('radio', {
      name: 'The organisation does not meet any of these conditions, but belongs to a corporate group containing an organisation that does meet these conditions',
    });
  }

  function submitBtn() {
    return screen.getByRole('button', { name: 'Save and continue' });
  }
});
