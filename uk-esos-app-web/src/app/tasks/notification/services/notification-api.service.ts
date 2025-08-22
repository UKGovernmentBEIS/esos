import { computed, Injectable, Signal } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

import { TaskApiServiceExtended } from '@common/forms/services/task-api.service';
import { requestTaskQuery } from '@common/request-task/+state';
import { PendingRequestService } from '@core/guards/pending-request.service';
import { BusinessErrorService } from '@error/business-error/business-error.service';
import { ErrorCode } from '@error/not-found-error';
import { notificationValidationError } from '@shared/errors/notification-error';
import {
  organisationCompaniesHouseApiServiceUnavailableError,
  organisationCompaniesHouseApiUnauthorizedError,
  organisationCompaniesHouseNotExistsError,
} from '@shared/errors/organisation-account-application-business-error';
import { taskNotFoundError } from '@shared/errors/request-task-error';

import { RequestTaskActionPayload, RequestTaskActionProcessDTO } from 'esos-api';

import { NotificationTaskPayload } from '../notification.types';
import { NotificationErrorData } from '../notification-errors/notification-errors.interfaces';
import { NotificationErrorService } from '../notification-errors/notification-errors.service';

type SaveActionTypes = {
  actionType: RequestTaskActionProcessDTO['requestTaskActionType'];
  actionPayloadType: RequestTaskActionPayload['payloadType'];
};

@Injectable()
export class NotificationApiService extends TaskApiServiceExtended<NotificationTaskPayload> {
  constructor(
    private readonly pendingRequestService: PendingRequestService,
    private readonly businessErrorService: BusinessErrorService,
    private readonly notificationErrorService: NotificationErrorService,
  ) {
    super();
  }

  save(payload: NotificationTaskPayload): Observable<void> {
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

  returnToSubmit() {
    return this.service.processRequestTaskAction(this.createActionMap().returnToSubmit).pipe(
      catchError((err) => {
        if (err.code === ErrorCode.NOTFOUND1001) {
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError);
        }
        return throwError(() => err);
      }),
      this.pendingRequestService.trackRequest(),
    );
  }

  sendToRestricted(userId: string) {
    return this.service
      .processRequestTaskAction({
        requestTaskActionType: 'NOTIFICATION_OF_COMPLIANCE_P3_SEND_TO_EDIT',
        requestTaskActionPayload: {
          payloadType: 'NOTIFICATION_OF_COMPLIANCE_P3_SEND_TO_EDIT_PAYLOAD',
          supportingOperator: userId,
        },
        requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      })
      .pipe(
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
            return this.businessErrorService.showError(organisationCompaniesHouseNotExistsError);
          case 'COMPANYINFO1001':
          case 'COMPANYINFO1003':
            return this.businessErrorService.showError(organisationCompaniesHouseApiServiceUnavailableError);
          case 'COMPANYINFO1002':
            return this.businessErrorService.showError(organisationCompaniesHouseApiUnauthorizedError);
          case 'NOC1001':
          case 'NOC1002':
            return this.notificationErrorService.showError(
              notificationValidationError,
              err.error as NotificationErrorData,
            );

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
      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_EDIT':
        return {
          actionType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_EDIT',
          actionPayloadType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_EDIT_PAYLOAD',
        };
      case 'NOTIFICATION_OF_COMPLIANCE_P3_APPLICATION_SUBMIT':
      default:
        return {
          actionType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT',
          actionPayloadType: 'NOTIFICATION_OF_COMPLIANCE_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD',
        };
    }
  }

  private createSaveAction(payload: NotificationTaskPayload): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { noc, nocSectionsCompleted } = payload;
    const { actionType, actionPayloadType } = this.saveActionTypes;

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload: {
        payloadType: actionPayloadType,
        noc,
        nocSectionsCompleted,
      },
    };
  }

  private createActionMap: Signal<Record<'returnToSubmit' | 'submit', RequestTaskActionProcessDTO>> = computed(() => ({
    returnToSubmit: {
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'NOTIFICATION_OF_COMPLIANCE_P3_RETURN_TO_SUBMIT',
      requestTaskActionPayload: {
        payloadType: 'EMPTY_PAYLOAD',
      } as RequestTaskActionPayload,
    },
    submit: {
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'NOTIFICATION_OF_COMPLIANCE_P3_SUBMIT_APPLICATION',
      requestTaskActionPayload: {
        payloadType: 'EMPTY_PAYLOAD',
      } as RequestTaskActionPayload,
    },
  }));
}
