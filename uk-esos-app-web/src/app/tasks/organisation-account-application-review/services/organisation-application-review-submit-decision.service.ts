import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RequestTaskStore } from '@common/request-task/+state';
import { PendingRequestService } from '@core/guards/pending-request.service';
import { BusinessErrorService } from '@error/business-error/business-error.service';
import { catchBadRequest, ErrorCodes } from '@error/business-errors';
import { ErrorCode } from '@error/not-found-error';
import {
  accountRegistrationNumberExistsError,
  organisationCompaniesHouseApiServiceUnavailableError,
  organisationCompaniesHouseApiUnauthorizedError,
  organisationCompaniesHouseNotExistsError,
} from '@shared/errors/organisation-account-application-business-error';

import { RequestTaskActionProcessDTO, TasksService } from 'esos-api';

@Injectable({
  providedIn: 'root',
})
export class OrganisationApplicationReviewSubmitDecisionService {
  constructor(
    private readonly tasksService: TasksService,
    private readonly pendingRequestService: PendingRequestService,
    private readonly businessErrorService: BusinessErrorService,
    private readonly requestTaskStore: RequestTaskStore,
  ) {}

  submitDecision(isAccepted: boolean, reason: string): Observable<any> {
    const state = this.requestTaskStore.state;
    const taskId = state.requestTaskItem.requestTask.id;
    const decisionPayload = this.mapToDecisionPayload(taskId, isAccepted, reason);

    return this.tasksService.processRequestTaskAction(decisionPayload).pipe(
      catchBadRequest(ErrorCodes.ACCOUNT1001, () =>
        this.businessErrorService.showError(accountRegistrationNumberExistsError),
      ),
      catchError((err) => {
        switch (err.error.code) {
          case ErrorCode.NOTFOUND1001:
            return this.businessErrorService.showError(organisationCompaniesHouseNotExistsError);
          case 'COMPANYINFO1001':
          case 'COMPANYINFO1003':
            return this.businessErrorService.showError(organisationCompaniesHouseApiServiceUnavailableError);
          case 'COMPANYINFO1002':
            return this.businessErrorService.showError(organisationCompaniesHouseApiUnauthorizedError);
          default:
            return throwError(() => err);
        }
      }),
      this.pendingRequestService.trackRequest(),
    );
  }

  private mapToDecisionPayload(
    requestTaskId: number,
    isAccepted: boolean,
    reason: string,
  ): RequestTaskActionProcessDTO {
    return {
      requestTaskActionPayload: {
        payloadType: 'ORGANISATION_ACCOUNT_OPENING_SUBMIT_DECISION_PAYLOAD',
        decision: isAccepted ? 'APPROVED' : 'REJECTED',
        reason,
      },
      requestTaskActionType: 'ORGANISATION_ACCOUNT_OPENING_SUBMIT_DECISION',
      requestTaskId: requestTaskId,
    };
  }
}
