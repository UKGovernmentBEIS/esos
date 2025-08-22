import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { RequestTaskStore } from '@common/request-task/+state';

import { RequestTaskPayload, TasksService } from 'esos-api';

export abstract class TaskApiService<T extends RequestTaskPayload> {
  protected readonly store = inject(RequestTaskStore);
  protected readonly service = inject(TasksService);

  abstract save(payload: T): Observable<void>;
  abstract submit(): Observable<void>;
}

export abstract class TaskApiServiceExtended<T extends RequestTaskPayload> extends TaskApiService<T> {
  abstract returnToSubmit(): Observable<void>;
  abstract sendToRestricted(userId: string): Observable<void>;
}
