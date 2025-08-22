import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { AccountClosureStep } from '@tasks/account-closure/account-closure-step-flow-manager';
import { AccountClosureTaskService } from '@tasks/account-closure/services/account-closure.service';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { RequestTaskItemDTO } from 'esos-api';

import { AccountClosureSubmitComponent } from './account-closure-submit.component';

describe('AccountClosureSubmitComponent', () => {
  let component: AccountClosureSubmitComponent;
  let fixture: ComponentFixture<AccountClosureSubmitComponent>;
  let page: Page;
  let store: RequestTaskStore;

  const activatedRoute = new ActivatedRouteStub();

  const taskService: MockType<AccountClosureTaskService> = {
    submit: jest.fn().mockImplementation(),
  };

  class Page extends BasePage<AccountClosureSubmitComponent> {
    get submitButton() {
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
    store.setRequestTaskItem({
      requestTask: { payload: { accountClosure: { reason: 'Lorem ipsum dolor sit amet' } } },
    } as Partial<RequestTaskItemDTO>);

    fixture = TestBed.createComponent(AccountClosureSubmitComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have submit disabled', () => {
    store.setRequestTaskItem({
      requestTask: { payload: { accountClosure: { reason: '' } } },
    } as Partial<RequestTaskItemDTO>);

    fixture.detectChanges();

    expect(page.submitButton.disabled).toBeTruthy();
  });

  it('should submit and navigate to confirmation page', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'submit');

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: AccountClosureStep.SUBMIT,
      currentStep: AccountClosureStep.SUBMIT,
      route: activatedRoute,
    });
  });
});
