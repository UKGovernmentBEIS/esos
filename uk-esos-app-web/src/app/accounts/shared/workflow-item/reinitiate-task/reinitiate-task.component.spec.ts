import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { of } from 'rxjs';

import { BasePage, mockClass } from '@testing';

import { RequestsService } from 'esos-api';

import { ReinitiateTaskComponent } from './reinitiate-task.component';

describe('ReinitiateTaskComponent', () => {
  let page: Page;
  let component: ReinitiateTaskComponent;
  let fixture: ComponentFixture<ReinitiateTaskComponent>;

  const requestService = mockClass(RequestsService);

  class Page extends BasePage<ReinitiateTaskComponent> {
    get submitButton() {
      return this.query<HTMLButtonElement>('button');
    }

    get confirmationMessage() {
      return this.query('.govuk-panel__body');
    }
  }

  const createComponent = async (requestId: string, taskType: string) => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                'request-id': requestId,
                accountId: '1',
                taskType,
              }),
            },
          },
        },
        { provide: RequestsService, useValue: requestService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReinitiateTaskComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  };

  afterEach(() => jest.clearAllMocks());

  it('should create', async () => {
    await createComponent('PU00001-2024', 'progress-update-1');
    expect(component).toBeTruthy();
  });

  it('should submit NOC action and show confirmation message', async () => {
    await createComponent('NOC00001-2024', 'noc');
    requestService.processRequestCreateAction.mockReturnValueOnce(of({ requestId: '1234' }));

    expect(page.confirmationMessage).toBeFalsy();

    page.submitButton.click();
    fixture.detectChanges();

    expect(requestService.processRequestCreateAction).toHaveBeenCalledTimes(1);
    expect(requestService.processRequestCreateAction).toHaveBeenCalledWith(
      {
        requestCreateActionType: 'RE_INITIATE_NOTIFICATION_OF_COMPLIANCE_P3',
        requestCreateActionPayload: {
          payloadType: 'REPORT_RELATED_REQUEST_CREATE_ACTION_PAYLOAD',
          requestId: 'NOC00001-2024',
        },
      },
      1,
    );
    fixture.detectChanges();

    expect(page.confirmationMessage).toBeTruthy();
    expect(page.confirmationMessage.textContent.trim()).toEqual("You've successfully returned the notification");
  });

  it('should submit re-initiate Action Plan action and show confirmation message', async () => {
    await createComponent('AP00001-2024', 'action-plan');
    requestService.processRequestCreateAction.mockReturnValueOnce(of({ requestId: '1234' }));

    expect(page.confirmationMessage).toBeFalsy();

    page.submitButton.click();
    fixture.detectChanges();

    expect(requestService.processRequestCreateAction).toHaveBeenCalledTimes(1);
    expect(requestService.processRequestCreateAction).toHaveBeenCalledWith(
      {
        requestCreateActionType: 'RE_INITIATE_ACTION_PLAN_P3',
        requestCreateActionPayload: {
          payloadType: 'REPORT_RELATED_REQUEST_CREATE_ACTION_PAYLOAD',
          requestId: 'AP00001-2024',
        },
      },
      1,
    );
    fixture.detectChanges();

    expect(page.confirmationMessage).toBeTruthy();
    expect(page.confirmationMessage.textContent.trim()).toEqual("You've successfully returned the action plan");
  });

  it('should submit re-initiate PU1 action and show confirmation message', async () => {
    await createComponent('PU00001-2024', 'progress-update-1');
    requestService.processRequestCreateAction.mockReturnValueOnce(of({ requestId: '1234' }));

    expect(page.confirmationMessage).toBeFalsy();

    page.submitButton.click();
    fixture.detectChanges();

    expect(requestService.processRequestCreateAction).toHaveBeenCalledTimes(1);
    expect(requestService.processRequestCreateAction).toHaveBeenCalledWith(
      {
        requestCreateActionType: 'RE_INITIATE_PROGRESS_UPDATE_1_P3',
        requestCreateActionPayload: {
          payloadType: 'REPORT_RELATED_REQUEST_CREATE_ACTION_PAYLOAD',
          requestId: 'PU00001-2024',
        },
      },
      1,
    );
    fixture.detectChanges();

    expect(page.confirmationMessage).toBeTruthy();
    expect(page.confirmationMessage.textContent.trim()).toEqual("You've successfully returned the progress update 1");
  });

  it('should submit re-initiate PU2 action and show confirmation message', async () => {
    await createComponent('PU20001-2024', 'progress-update-2');
    requestService.processRequestCreateAction.mockReturnValueOnce(of({ requestId: '1234' }));

    expect(page.confirmationMessage).toBeFalsy();

    page.submitButton.click();
    fixture.detectChanges();

    expect(requestService.processRequestCreateAction).toHaveBeenCalledTimes(1);
    expect(requestService.processRequestCreateAction).toHaveBeenCalledWith(
      {
        requestCreateActionType: 'RE_INITIATE_PROGRESS_UPDATE_2_P3',
        requestCreateActionPayload: {
          payloadType: 'REPORT_RELATED_REQUEST_CREATE_ACTION_PAYLOAD',
          requestId: 'PU20001-2024',
        },
      },
      1,
    );
    fixture.detectChanges();

    expect(page.confirmationMessage).toBeTruthy();
    expect(page.confirmationMessage.textContent.trim()).toEqual("You've successfully returned the progress update 2");
  });
});
