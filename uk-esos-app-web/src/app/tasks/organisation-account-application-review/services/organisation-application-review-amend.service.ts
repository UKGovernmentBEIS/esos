import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RequestTaskStore } from '@common/request-task/+state';
import { PendingRequestService } from '@core/guards/pending-request.service';
import { BusinessErrorService } from '@error/business-error/business-error.service';
import { ErrorCode } from '@error/not-found-error';
import { taskNotFoundError } from '@shared/errors/request-task-error';

import {
  OrganisationAccountOpeningApplicationRequestTaskPayload,
  OrganisationAccountPayload,
  RequestTaskActionProcessDTO,
  TasksService,
} from 'esos-api';

@Injectable({
  providedIn: 'root',
})
export class OrganisationApplicationReviewAmendService {
  constructor(
    private tasksService: TasksService,
    private readonly pendingRequestService: PendingRequestService,
    private readonly businessErrorService: BusinessErrorService,
    private readonly requestTaskStore: RequestTaskStore,
  ) {}

  submitAmendRequest(): Observable<any> {
    const state = this.requestTaskStore.state;
    const taskId = state.requestTaskItem.requestTask.id;
    const payload = state.requestTaskItem.requestTask
      .payload as OrganisationAccountOpeningApplicationRequestTaskPayload;
    const account = payload.account;
    const amendPayload = this.mapToAmendPayload(taskId, account);

    return this.tasksService.processRequestTaskAction(amendPayload).pipe(
      catchError((err) => {
        if (err.code === ErrorCode.NOTFOUND1001) {
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError);
        }
        return throwError(err);
      }),
      this.pendingRequestService.trackRequest(),
    );
  }

  private mapToAmendPayload(requestTaskId: number, account: OrganisationAccountPayload): RequestTaskActionProcessDTO {
    return {
      requestTaskActionType: 'ORGANISATION_ACCOUNT_OPENING_AMEND_APPLICATION',
      requestTaskActionPayload: {
        payloadType: 'ORGANISATION_ACCOUNT_OPENING_AMEND_APPLICATION_PAYLOAD',
        name: account.name,
        line1: account.line1,
        line2: account?.line2,
        city: account.city,
        county: account.county,
        postcode: account.postcode,
        type: account.type,
        otherTypeName: account.otherTypeName,
        codes: account.codes,
      },
      requestTaskId: requestTaskId,
    };
  }
}
