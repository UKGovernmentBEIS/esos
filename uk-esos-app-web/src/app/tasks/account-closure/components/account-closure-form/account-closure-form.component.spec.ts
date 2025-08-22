import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { AccountClosureStep } from '@tasks/account-closure/account-closure-step-flow-manager';
import { AccountClosureTaskService } from '@tasks/account-closure/services/account-closure.service';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { RequestTaskItemDTO } from 'esos-api';

import { AccountClosureFormComponent } from './account-closure-form.component';

describe('AccountClosureFormComponent', () => {
  let component: AccountClosureFormComponent;
  let fixture: ComponentFixture<AccountClosureFormComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const activatedRoute = new ActivatedRouteStub();

  const taskService: MockType<AccountClosureTaskService> = {
    save: jest.fn().mockImplementation(),
    payload: {},
  };

  class Page extends BasePage<AccountClosureFormComponent> {
    get reason() {
      return this.getInputValue('#reason');
    }

    set reason(value: string) {
      this.setInputValue('#reason', value);
    }

    get errorSummary(): HTMLDivElement {
      return this.query<HTMLDivElement>('.govuk-error-summary');
    }

    get submitButton(): HTMLButtonElement {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AccountClosureTaskService, useValue: taskService },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setIsEditable(true);
    store.setRequestTaskItem({
      requestTask: { payload: { accountClosure: { reason: null } } },
    } as Partial<RequestTaskItemDTO>);

    fixture = TestBed.createComponent(AccountClosureFormComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements and form with 0 errors', () => {
    expect(page.errorSummary).toBeFalsy();
    expect(page.reason).toEqual('');
    expect(page.submitButton).toBeTruthy();
  });

  it('should display errors if trying to submit an invalid form', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'save');

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledTimes(0);
    expect(page.errorSummary).toBeVisible();
    expect(page.errorSummary.textContent).toContain('There is a problem');
    expect(page.errorSummary.textContent).toContain('Enter a reason for closing the account');
  });

  it('should submit a valid form', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'save');

    page.reason = 'Lorem ipsum dolor sit amet';

    page.submitButton.click();
    fixture.detectChanges();

    expect(page.errorSummary).toBeFalsy();
    expect(taskServiceSpy).toHaveBeenCalledTimes(1);
    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: AccountClosureStep.FORM,
      currentStep: AccountClosureStep.FORM,
      route: activatedRoute,
      payload: { accountClosure: { reason: 'Lorem ipsum dolor sit amet' } },
    });
  });
});
