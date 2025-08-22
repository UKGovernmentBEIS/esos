import { inject, Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

import { TaskApiService } from '@common/forms/services/task-api.service';
import { requestTaskQuery } from '@common/request-task/+state';
import { PendingRequestService } from '@core/guards/pending-request.service';
import { BusinessErrorService } from '@error/business-error/business-error.service';
import { ErrorCode } from '@error/not-found-error';
import { progressUpdate1ValidationError } from '@shared/errors/progress-update-1-error';
import { taskNotFoundError } from '@shared/errors/request-task-error';

import {
  ProgressUpdate1P3Payload,
  ProgressUpdate1P3UpdatedMeasurePayload,
  RequestTaskActionProcessDTO,
} from 'esos-api';

import { ProgressUpdate1TaskPayload } from '../progress-update-1.types';
import { ProgressUpdate1ErrorService } from '../progress-update-1-errors/progress-update-1-errors.service';

@Injectable()
export class ProgressUpdate1ApiService extends TaskApiService<ProgressUpdate1TaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);
  private readonly progressUpdate1ErrorService = inject(ProgressUpdate1ErrorService);

  save(payload: ProgressUpdate1TaskPayload): Observable<void> {
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
          case ErrorCode.NOTFOUND1001:
            return this.businessErrorService.showErrorForceNavigation(taskNotFoundError);
          case 'PU11001': // PROGRESS_UPDATE_1_P3_MISSING_ACTION_PLAN_SBM_DATE
          case 'PU11002': // PROGRESS_UPDATE_INVALID_SUBMIT_DATE
          case 'PU11003': // INVALID_PROGRESS_UPDATE_1
            return this.progressUpdate1ErrorService.showError(progressUpdate1ValidationError, err.error);
          default:
            return throwError(() => err);
        }
      }),
      this.pendingRequestService.trackRequest(),
    );
  }

  private createSaveAction(payload: ProgressUpdate1TaskPayload): RequestTaskActionProcessDTO {
    const progressUpdate1P3Measures: ProgressUpdate1P3UpdatedMeasurePayload[] =
      payload.progressUpdate1P3.progressUpdate1P3MeasuresUpdate.progressUpdate1P3Measures.map(
        ({ uuId, progressUpdate1P3EnergyEfficiencyMeasure }) => ({ uuId, progressUpdate1P3EnergyEfficiencyMeasure }),
      );

    const progressUpdate1P3: ProgressUpdate1P3Payload = {
      ...payload.progressUpdate1P3,
      progressUpdate1P3MeasuresUpdate: {
        ...payload.progressUpdate1P3.progressUpdate1P3MeasuresUpdate,
        progressUpdate1P3Measures,
      },
    };

    return {
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'PROGRESS_UPDATE_1_P3_SAVE_APPLICATION_SUBMIT',
      requestTaskActionPayload: {
        payloadType: 'PROGRESS_UPDATE_1_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD',
        progressUpdate1P3,
        progressUpdate1P3SectionsCompleted: payload.progressUpdate1P3SectionsCompleted,
      },
    };
  }

  private createSubmitAction(): RequestTaskActionProcessDTO {
    return {
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'PROGRESS_UPDATE_1_P3_SUBMIT_APPLICATION',
      requestTaskActionPayload: { payloadType: 'EMPTY_PAYLOAD' },
    };
  }
}
