import { TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';

import { of } from 'rxjs';

import { ItemLinkPipe } from '@shared/pipes/item-link.pipe';
import { mockClass } from '@testing';

import {
  ItemDTOResponse,
  ProgressUpdate1RequestCreateActionPayload,
  RequestActionDTO,
  RequestCreateActionPayload,
  RequestCreateActionProcessResponseDTO,
  RequestCreateValidationResult,
  RequestItemsService,
  RequestsService,
} from 'esos-api';

import { ProcessActionsService } from './process-actions.service';

type RequestType =
  | 'NOTIFICATION_OF_COMPLIANCE_P3'
  | 'ACTION_PLAN_P3'
  | 'ACCOUNT_CLOSURE'
  | 'PROGRESS_UPDATE_1_P3'
  | 'PROGRESS_UPDATE_2_P3';

describe('ProcessActionsService', () => {
  let service: ProcessActionsService;
  let router: Router;
  const taskId = 1;
  const accountId = 0;
  const processRequestCreateActionResponse: RequestCreateActionProcessResponseDTO = { requestId: '1234' };
  const requestsService = mockClass(RequestsService);
  const requestItemsService = mockClass(RequestItemsService);

  const createModule = async (
    mockedWorkflows?: Partial<Record<RequestActionDTO['requestType'], RequestCreateValidationResult>>,
  ) => {
    requestsService.processRequestCreateAction.mockReturnValue(of(processRequestCreateActionResponse));
    requestsService.getAvailableAccountWorkflows.mockReturnValue(of(mockedWorkflows ?? {}));

    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [
        ProcessActionsService,
        { provide: RequestsService, useValue: requestsService },
        { provide: RequestItemsService, useValue: requestItemsService },
        ItemLinkPipe,
      ],
    });

    router = TestBed.inject(Router);
    service = TestBed.inject(ProcessActionsService);
  };

  const createRequestPayload = (requestType, payload) => ({
    requestCreateActionType: requestType,
    requestCreateActionPayload: payload,
  });

  const testProcessRequestCreateActionAndNavigate = async (
    requestType: RequestType,
    requestPayload: RequestCreateActionPayload | ProgressUpdate1RequestCreateActionPayload = {
      payloadType: 'EMPTY_PAYLOAD',
    },
    isDisaggregateUndertaking = false,
  ) => {
    const getItemsResponse: ItemDTOResponse = { items: [{ requestType, taskId }] };
    requestItemsService.getItemsByRequest.mockReturnValueOnce(of(getItemsResponse));
    await createModule({ [requestType]: { valid: true } });

    const navigateSpy = jest.spyOn(router, 'navigate');

    service.processRequestCreateAction({ requestType: requestType, accountId, isDisaggregateUndertaking });

    expect(requestsService.processRequestCreateAction).toHaveBeenCalledTimes(1);
    expect(requestsService.processRequestCreateAction).toHaveBeenCalledWith(
      createRequestPayload(requestType, requestPayload),
      0,
    );

    expect(requestItemsService.getItemsByRequest).toHaveBeenCalledTimes(1);
    expect(requestItemsService.getItemsByRequest).toHaveBeenCalledWith(processRequestCreateActionResponse.requestId);

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/tasks', taskId]);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', async () => {
    await createModule();
    expect(service).toBeTruthy();
  });

  it('should handle NOTIFICATION_OF_COMPLIANCE_P3 request type, navigate to the task item page, when a single Task Item is received', async () => {
    await testProcessRequestCreateActionAndNavigate('NOTIFICATION_OF_COMPLIANCE_P3');
  });

  it('should handle ACTION_PLAN_P3 request type, navigate to the task item page, when a single Task Item is received', async () => {
    await testProcessRequestCreateActionAndNavigate('ACTION_PLAN_P3');
  });

  it('should handle PROGRESS_UPDATE_1_P3 request type without disaggregate undertaking, navigate to the task item page, when a single Task Item is received', async () => {
    await testProcessRequestCreateActionAndNavigate('PROGRESS_UPDATE_1_P3', {
      payloadType: 'PROGRESS_UPDATE_1_CREATE_ACTION_PAYLOAD',
      isDisaggregateUndertaking: false,
    });
  });

  it('should handle PROGRESS_UPDATE_1_P3 request type with disaggregate undertaking, navigate to the task item page, when a single Task Item is received', async () => {
    await testProcessRequestCreateActionAndNavigate(
      'PROGRESS_UPDATE_1_P3',
      {
        payloadType: 'PROGRESS_UPDATE_1_CREATE_ACTION_PAYLOAD',
        isDisaggregateUndertaking: true,
      },
      true,
    );
  });

  it('should handle PROGRESS_UPDATE_2_P3 request type without disaggregate undertaking, navigate to the task item page, when a single Task Item is received', async () => {
    await testProcessRequestCreateActionAndNavigate('PROGRESS_UPDATE_2_P3', {
      payloadType: 'PROGRESS_UPDATE_2_CREATE_ACTION_PAYLOAD',
      isDisaggregateUndertaking: false,
    });
  });

  it('should handle PROGRESS_UPDATE_2_P3 request type with disaggregate undertaking, navigate to the task item page, when a single Task Item is received', async () => {
    await testProcessRequestCreateActionAndNavigate(
      'PROGRESS_UPDATE_2_P3',
      {
        payloadType: 'PROGRESS_UPDATE_2_CREATE_ACTION_PAYLOAD',
        isDisaggregateUndertaking: true,
      },
      true,
    );
  });

  it('should processRequestCreateAction, navigate to dashboard when 0 task Items are received', async () => {
    requestItemsService.getItemsByRequest.mockReturnValueOnce(of({ items: [] }));
    await createModule({ NOTIFICATION_OF_COMPLIANCE_P3: { valid: true } });

    const navigateSpy = jest.spyOn(router, 'navigate');
    service.processRequestCreateAction({ requestType: 'NOTIFICATION_OF_COMPLIANCE_P3', accountId });

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenLastCalledWith(['/dashboard']);
  });

  it('should processRequestCreateAction, navigate to dashboard when multiple task Items are received', async () => {
    requestItemsService.getItemsByRequest.mockReturnValueOnce(
      of({
        items: [
          { requestType: 'NOTIFICATION_OF_COMPLIANCE_P3', taskId: taskId },
          { requestType: 'NOTIFICATION_OF_COMPLIANCE_P3', taskId: taskId + 1 },
        ],
      }),
    );
    await createModule({ NOTIFICATION_OF_COMPLIANCE_P3: { valid: true } });

    const navigateSpy = jest.spyOn(router, 'navigate');
    service.processRequestCreateAction({ requestType: 'NOTIFICATION_OF_COMPLIANCE_P3', accountId });

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenLastCalledWith(['/dashboard']);
  });
});
