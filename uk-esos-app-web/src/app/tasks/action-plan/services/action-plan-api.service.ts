import { computed, Injectable, Signal } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

import { TaskApiService } from '@common/forms/services/task-api.service';
import { requestTaskQuery } from '@common/request-task/+state';
import { PendingRequestService } from '@core/guards/pending-request.service';
import { BusinessErrorService } from '@error/business-error/business-error.service';
import { ErrorCode } from '@error/not-found-error';
import { actionPlanValidationError } from '@shared/errors/action-plan-error';
import { taskNotFoundError } from '@shared/errors/request-task-error';

import { RequestTaskActionPayload, RequestTaskActionProcessDTO } from 'esos-api';

import { ActionPlanTaskPayload } from '../action-plan.types';
import { ActionPlanErrorService } from '../action-plan-errors/action-plan-errors.service';

type SaveActionTypes = {
  actionType: RequestTaskActionProcessDTO['requestTaskActionType'];
  actionPayloadType: RequestTaskActionPayload['payloadType'];
};

@Injectable()
export class ActionPlanApiService extends TaskApiService<ActionPlanTaskPayload> {
  constructor(
    private readonly pendingRequestService: PendingRequestService,
    private readonly businessErrorService: BusinessErrorService,
    private readonly actionPlanErrorService: ActionPlanErrorService,
  ) {
    super();
  }

  save(payload: ActionPlanTaskPayload): Observable<void> {
    return this.service.processRequestTaskAction(this.createSaveAction(payload)).pipe(
      catchError((err) => {
        if (err.code === ErrorCode.NOTFOUND1001) {
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError);
        }
        return throwError(() => err);
      }),
      this.pendingRequestService.trackRequest(),
    );
  }

  submit(): Observable<void> {
    return this.service.processRequestTaskAction(this.createActionMap().submit).pipe(
      catchError((err) => {
        switch (err.error.code) {
          case ErrorCode.NOTFOUND1001:
            return this.businessErrorService.showErrorForceNavigation(taskNotFoundError);
          case 'AP1001':
          case 'AP1002':
            return this.actionPlanErrorService.showError(actionPlanValidationError, err.error);
          default:
            return throwError(() => err);
        }
      }),
      this.pendingRequestService.trackRequest(),
    );
  }

  private get saveActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'ACTION_PLAN_P3_APPLICATION_SUBMIT':
      default:
        return {
          actionType: 'ACTION_PLAN_P3_SAVE_APPLICATION_SUBMIT',
          actionPayloadType: 'ACTION_PLAN_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD',
        };
    }
  }

  private createSaveAction(payload: ActionPlanTaskPayload): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { actionPlanP3, actionPlanSectionsCompleted } = payload;
    const { actionType, actionPayloadType } = this.saveActionTypes;

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload: {
        payloadType: actionPayloadType,
        actionPlanP3,
        actionPlanSectionsCompleted,
      },
    };
  }

  private createActionMap: Signal<Record<'submit', RequestTaskActionProcessDTO>> = computed(() => ({
    submit: {
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'ACTION_PLAN_P3_SUBMIT_APPLICATION',
      requestTaskActionPayload: {
        payloadType: 'EMPTY_PAYLOAD',
      } as RequestTaskActionPayload,
    },
  }));
}
