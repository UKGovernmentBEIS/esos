import { inject, Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

import { TaskApiService } from '@common/forms/services/task-api.service';
import { requestTaskQuery } from '@common/request-task/+state';
import { PendingRequestService } from '@core/guards/pending-request.service';
import { BusinessErrorService } from '@error/business-error/business-error.service';
import { ErrorCode } from '@error/not-found-error';
import { taskNotFoundError } from '@shared/errors/request-task-error';

import { RequestTaskActionPayload, RequestTaskActionProcessDTO } from 'esos-api';

import { AccountClosureTaskPayload } from '../account-closure.types';

@Injectable({ providedIn: 'root' })
export class AccountClosureApiService extends TaskApiService<AccountClosureTaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  save(payload: AccountClosureTaskPayload): Observable<void> {
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
    return this.service.processRequestTaskAction(this.createSubmitAction()).pipe(
      catchError((err) => {
        switch (err.error.code) {
          default:
            return throwError(() => err);
        }
      }),
      this.pendingRequestService.trackRequest(),
    );
  }

  private createSaveAction(payload: AccountClosureTaskPayload): RequestTaskActionProcessDTO {
    return {
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'ACCOUNT_CLOSURE_SAVE_APPLICATION_SUBMIT',
      requestTaskActionPayload: {
        payloadType: 'ACCOUNT_CLOSURE_SAVE_APPLICATION_SUBMIT_PAYLOAD',
        accountClosure: payload.accountClosure,
      },
    };
  }

  private createSubmitAction(): RequestTaskActionProcessDTO {
    return {
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'ACCOUNT_CLOSURE_SUBMIT_APPLICATION',
      requestTaskActionPayload: { payloadType: 'EMPTY_PAYLOAD' } as RequestTaskActionPayload,
    };
  }
}
