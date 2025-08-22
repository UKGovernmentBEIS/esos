import { inject, Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

import { TaskApiService } from '@common/forms/services/task-api.service';
import { requestTaskQuery } from '@common/request-task/+state';
import { PendingRequestService } from '@core/guards/pending-request.service';
import { BusinessErrorService } from '@error/business-error/business-error.service';
import { ErrorCode } from '@error/not-found-error';
import { progressUpdate2ValidationError } from '@shared/errors/progress-update-2-error';
import { taskNotFoundError } from '@shared/errors/request-task-error';

import {
  ProgressUpdate2P3Payload,
  ProgressUpdate2P3UpdatedMeasurePayload,
  RequestTaskActionProcessDTO,
} from 'esos-api';

import { ProgressUpdate2TaskPayload } from '../progress-update-2.types';
import { ProgressUpdate2ErrorService } from '../progress-update-2-errors/progress-update-2-errors.service';

@Injectable()
export class ProgressUpdate2ApiService extends TaskApiService<ProgressUpdate2TaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);
  private readonly progressUpdate2ErrorService = inject(ProgressUpdate2ErrorService);

  save(payload: ProgressUpdate2TaskPayload): Observable<void> {
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
          case 'PU11002': // PROGRESS_UPDATE_INVALID_SUBMIT_DATE
          case 'PU21004': // INVALID_PROGRESS_UPDATE_2
            return this.progressUpdate2ErrorService.showError(progressUpdate2ValidationError, err.error);
          default:
            return throwError(() => err);
        }
      }),
      this.pendingRequestService.trackRequest(),
    );
  }

  private createSaveAction(payload: ProgressUpdate2TaskPayload): RequestTaskActionProcessDTO {
    const progressUpdate2P3Measures: ProgressUpdate2P3UpdatedMeasurePayload[] = [
      ...payload.progressUpdate2P3.progressUpdate2P3MeasuresUpdate.progressUpdate2P3Measures,
      ...payload.progressUpdate2P3.progressUpdate2P3MeasuresUpdate.progressUpdate2P3UpdatedAddedMeasures,
    ].map(({ uuId, progressUpdate2P3EnergyEfficiencyMeasure }) => ({ uuId, progressUpdate2P3EnergyEfficiencyMeasure }));

    const progressUpdate2P3: ProgressUpdate2P3Payload = {
      ...payload.progressUpdate2P3,
      progressUpdate2P3MeasuresUpdate: {
        progressUpdate2P3Measures,
        progressUpdate2P3AddedMeasure:
          payload.progressUpdate2P3.progressUpdate2P3MeasuresUpdate.progressUpdate2P3AddedMeasure,
      },
    };

    return {
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'PROGRESS_UPDATE_2_P3_SAVE_APPLICATION_SUBMIT',
      requestTaskActionPayload: {
        payloadType: 'PROGRESS_UPDATE_2_P3_SAVE_APPLICATION_SUBMIT_PAYLOAD',
        progressUpdate2P3,
        progressUpdate2P3SectionsCompleted: payload.progressUpdate2P3SectionsCompleted,
      },
    };
  }

  private createSubmitAction(): RequestTaskActionProcessDTO {
    return {
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'PROGRESS_UPDATE_2_P3_SUBMIT_APPLICATION',
      requestTaskActionPayload: { payloadType: 'EMPTY_PAYLOAD' },
    };
  }
}
