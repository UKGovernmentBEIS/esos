import { inject, Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

import { PendingRequestService } from '@core/guards/pending-request.service';

import { RequestTaskActionProcessDTO, TasksService } from 'esos-api';

@Injectable({ providedIn: 'root' })
export class CancelTaskService {
  private readonly tasksService = inject(TasksService);
  private readonly pendingRequestService = inject(PendingRequestService);

  cancel({
    requestTaskId,
    requestTaskActionType,
  }: {
    requestTaskId: number;
    requestTaskActionType: RequestTaskActionProcessDTO['requestTaskActionType'];
  }): Observable<void> {
    return this.tasksService
      .processRequestTaskAction(this.createCancelAction(requestTaskId, requestTaskActionType))
      .pipe(
        catchError((err) => throwError(() => err)),
        this.pendingRequestService.trackRequest(),
      );
  }

  private createCancelAction(
    requestTaskId: number,
    requestTaskActionType: RequestTaskActionProcessDTO['requestTaskActionType'],
  ): RequestTaskActionProcessDTO {
    return {
      requestTaskId,
      requestTaskActionType,
      requestTaskActionPayload: { payloadType: 'EMPTY_PAYLOAD' },
    };
  }
}
