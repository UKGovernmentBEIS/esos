import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router, RouterModule } from '@angular/router';

import { BehaviorSubject, of } from 'rxjs';

import { CancelTaskService } from '@common/cancel-task/cancel-task.service';
import { RequestTaskStore } from '@common/request-task/+state';
import { BREADCRUMB_ITEMS } from '@core/navigation/breadcrumbs';
import { BasePage, MockType } from '@testing';
import { KeycloakService } from 'keycloak-angular';

import { RequestTaskItemDTO } from 'esos-api';

import { CancelComponent } from './cancel.component';

describe('CancelComponent', () => {
  let component: CancelComponent;
  let fixture: ComponentFixture<CancelComponent>;
  let store: RequestTaskStore;
  let page: Page;
  let router: Router;

  const route = {
    paramMap: of(convertToParamMap({ taskId: 1 })),
    routeConfig: { path: 'cancel' },
    parent: { routeConfig: { path: '' } },
  };
  const breadcrumbs = new BehaviorSubject([{ text: 'Parent', link: [''] }]);

  const cancelTaskService: MockType<CancelTaskService> = {
    cancel: jest.fn().mockReturnValue(of(null)),
  };

  const accountClosureRequestTaskItem = {
    requestTask: { id: 1, type: 'ACCOUNT_CLOSURE_SUBMIT', payload: { accountClosure: { reason: null } } },
    allowedRequestTaskActions: ['ACCOUNT_CLOSURE_CANCEL_APPLICATION'],
  } as Partial<RequestTaskItemDTO>;

  class Page extends BasePage<CancelComponent> {
    get title() {
      return this.query('h1.govuk-heading-l');
    }

    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="submit"]');
    }
  }

  function createComponent(requestTaskItem?: Partial<RequestTaskItemDTO>) {
    TestBed.configureTestingModule({
      providers: [
        KeycloakService,
        { provide: BREADCRUMB_ITEMS, useValue: breadcrumbs },
        { provide: ActivatedRoute, useValue: route },
        { provide: CancelTaskService, useValue: cancelTaskService },
      ],
      imports: [RouterModule.forRoot([]), CancelComponent],
    });

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockImplementation();

    store = TestBed.inject(RequestTaskStore);

    if (requestTaskItem) {
      store.setRequestTaskItem(requestTaskItem);
    }

    fixture = TestBed.createComponent(CancelComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent(accountClosureRequestTaskItem);
    expect(component).toBeTruthy();
  });

  it('should show page elements', () => {
    createComponent(accountClosureRequestTaskItem);
    expect(page.title).toBeTruthy();
    expect(page.title.textContent.trim()).toBe('Are you sure you want to cancel this task?');
    expect(page.submitButton).toBeTruthy();
  });

  it('should navigate to 404 if cancel action not allowed', () => {
    createComponent({
      requestTask: { id: 1, type: 'ACTION_PLAN_P3_APPLICATION_SUBMIT' },
      allowedRequestTaskActions: [],
    } as Partial<RequestTaskItemDTO>);

    const navigateSpy = jest.spyOn(router, 'navigate');
    fixture.detectChanges();
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('should submit cancel account closure task action', () => {
    createComponent(accountClosureRequestTaskItem);
    const cancelServiceSpy = jest.spyOn(cancelTaskService, 'cancel');

    const navigateSpy = jest.spyOn(router, 'navigate');
    expect(navigateSpy).toHaveBeenCalledTimes(0);

    page.submitButton.click();
    fixture.detectChanges();

    expect(cancelServiceSpy).toHaveBeenCalledTimes(1);
    expect(cancelServiceSpy).toHaveBeenCalledWith({
      requestTaskId: 1,
      requestTaskActionType: 'ACCOUNT_CLOSURE_CANCEL_APPLICATION',
    });
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });
});
