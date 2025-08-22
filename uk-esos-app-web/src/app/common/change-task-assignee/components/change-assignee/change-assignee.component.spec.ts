import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';

import { of } from 'rxjs';

import { PendingRequestService } from '@core/guards/pending-request.service';
import { AuthStore } from '@core/store/auth';
import { BusinessErrorService } from '@error/business-error/business-error.service';
import { SharedModule } from '@shared/shared.module';
import { BasePage, mockClass } from '@testing';

import { TasksAssignmentService, TasksReleaseService } from 'esos-api';

import { RequestTaskStore } from '../../../request-task/+state';
import { ChangeAssigneeComponent } from './change-assignee.component';

describe('ChangeAssigneeComponent', () => {
  let page: Page;
  let store: RequestTaskStore;
  let authStore: AuthStore;
  let fixture: ComponentFixture<ChangeAssigneeComponent>;
  let component: ChangeAssigneeComponent;

  const tasksAssignmentService = mockClass(TasksAssignmentService);
  tasksAssignmentService.assignTask.mockReturnValue(of({}));
  tasksAssignmentService.getCandidateAssigneesByTaskId.mockReturnValue(
    of([
      { id: '3954e888-40fb-4d6b-a367-6416b354ba08', firstName: 'Obi', lastName: 'Wan' },
      { id: '7b91199c-4770-4d4b-a0ed-d6d9667de157', firstName: 'Darth', lastName: 'Vader' },
    ]),
  );

  const mockPendingRequestService = mockClass(PendingRequestService);
  mockPendingRequestService.trackRequest = jest.fn(() => () => of(null));

  class Page extends BasePage<ChangeAssigneeComponent> {
    get select(): HTMLSelectElement {
      return this.query('select');
    }
    get button(): HTMLButtonElement {
      return this.query('button');
    }
    get options(): string[] {
      return Array.from(this.select.options).map((option) => option.textContent.trim());
    }

    set selectValue(value: string) {
      this.setInputValue('select', value);
    }

    get errorSummary(): HTMLDivElement {
      return this.query('.govuk-error-summary');
    }

    get errorSummaryErrorList() {
      return Array.from(this.query<HTMLDivElement>('.govuk-error-summary').querySelectorAll('a')).map((anchor) =>
        anchor.textContent.trim(),
      );
    }
  }

  const createComponent = async () => {
    fixture = TestBed.createComponent(ChangeAssigneeComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
    jest.clearAllMocks();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeAssigneeComponent, RouterModule.forRoot([]), SharedModule],
      providers: [
        { provide: TasksAssignmentService, useValue: tasksAssignmentService },
        { provide: TasksReleaseService, useValue: mockClass(TasksReleaseService) },
        { provide: PendingRequestService, useValue: mockPendingRequestService },
        { provide: BusinessErrorService, useValue: mockClass(BusinessErrorService) },
      ],
    }).compileComponents();

    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockImplementation();
  });

  describe('for operator', () => {
    beforeEach(async () => {
      authStore = TestBed.inject(AuthStore);
      authStore.setUserState({ roleType: 'OPERATOR' });
      store = TestBed.inject(RequestTaskStore);
      store.setRequestTaskItem({ requestTask: { id: 856, assigneeUserId: '7b91199c-4770-4d4b-a0ed-d6d9667de157' } });
      await createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should populate the select with no currently selected and not release option', async () => {
      expect(page.options).toEqual(['Obi Wan']);
    });

    it('should display error if no assignee selected', () => {
      const submitSpy = jest.spyOn(component, 'submit');

      page.button.click();
      fixture.detectChanges();

      expect(submitSpy).toHaveBeenCalledTimes(1);
      expect(tasksAssignmentService.assignTask).toHaveBeenCalledTimes(0);

      expect(page.errorSummary).toBeTruthy();
      expect(page.errorSummaryErrorList).toEqual(['Select a person']);
    });

    it('should post assignment and emit submitted', () => {
      const submitSpy = jest.spyOn(component, 'submit');

      expect(tasksAssignmentService.assignTask).toHaveBeenCalledTimes(0);
      expect(submitSpy).toHaveBeenCalledTimes(0);

      page.selectValue = '3954e888-40fb-4d6b-a367-6416b354ba08';
      page.button.click();

      expect(tasksAssignmentService.assignTask).toHaveBeenCalledTimes(1);
      expect(tasksAssignmentService.assignTask).toHaveBeenCalledWith({
        taskId: 856,
        userId: '3954e888-40fb-4d6b-a367-6416b354ba08',
      });
      expect(submitSpy).toHaveBeenCalledTimes(1);
      expect(submitSpy).toHaveBeenCalledWith(856, '3954e888-40fb-4d6b-a367-6416b354ba08');
    });
  });

  describe('for regulator', () => {
    beforeEach(async () => {
      authStore = TestBed.inject(AuthStore);
      authStore.setUserState({ roleType: 'REGULATOR' });
      store = TestBed.inject(RequestTaskStore);
      store.setRequestTaskItem({ requestTask: { id: 856, assigneeUserId: '7b91199c-4770-4d4b-a0ed-d6d9667de157' } });
      await createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should populate the select with no currently selected and with release option', () => {
      expect(page.options).toEqual(['Unassigned', 'Obi Wan']);
    });

    it('should post assignment and emit submitted', () => {
      const submitSpy = jest.spyOn(component, 'submit');

      expect(tasksAssignmentService.assignTask).toHaveBeenCalledTimes(0);
      expect(submitSpy).toHaveBeenCalledTimes(0);

      page.selectValue = '3954e888-40fb-4d6b-a367-6416b354ba08';
      page.button.click();

      expect(tasksAssignmentService.assignTask).toHaveBeenCalledTimes(1);
      expect(tasksAssignmentService.assignTask).toHaveBeenCalledWith({
        taskId: 856,
        userId: '3954e888-40fb-4d6b-a367-6416b354ba08',
      });
      expect(submitSpy).toHaveBeenCalledTimes(1);
      expect(submitSpy).toHaveBeenCalledWith(856, '3954e888-40fb-4d6b-a367-6416b354ba08');
    });
  });
});
