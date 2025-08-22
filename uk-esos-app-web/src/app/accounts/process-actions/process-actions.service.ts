import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { first, switchMap } from 'rxjs';

import { ItemLinkPipe } from '@shared/pipes/item-link.pipe';

import {
  ProgressUpdate1RequestCreateActionPayload,
  ProgressUpdate2RequestCreateActionPayload,
  RequestCreateActionPayload,
  RequestCreateActionProcessDTO,
  RequestItemsService,
  RequestsService,
} from 'esos-api';

@Injectable({ providedIn: 'root' })
export class ProcessActionsService {
  private readonly requestsService = inject(RequestsService);
  private readonly requestItemsService = inject(RequestItemsService);
  private readonly router = inject(Router);
  private readonly itemLinkPipe = inject(ItemLinkPipe);

  processRequestCreateAction({
    requestType,
    accountId,
    isDisaggregateUndertaking = false,
  }: {
    requestType: RequestCreateActionProcessDTO['requestCreateActionType'];
    accountId: number;
    isDisaggregateUndertaking?: boolean;
  }) {
    const requestCreateActionPayload = this.createRequestPayload(requestType, isDisaggregateUndertaking);

    this.requestsService
      .processRequestCreateAction(
        {
          requestCreateActionType: requestType,
          requestCreateActionPayload,
        },
        accountId,
      )
      .pipe(
        switchMap(({ requestId }) => this.requestItemsService.getItemsByRequest(requestId)),
        first(),
      )
      .subscribe(({ items }) => {
        const link = items?.length === 1 ? this.itemLinkPipe.transform(items[0]) : ['/dashboard'];
        this.router.navigate(link).then();
      });
  }

  private createRequestPayload(
    requestType: RequestCreateActionProcessDTO['requestCreateActionType'],
    isDisaggregateUndertaking: boolean,
  ):
    | RequestCreateActionPayload
    | ProgressUpdate1RequestCreateActionPayload
    | ProgressUpdate2RequestCreateActionPayload {
    let requestCreateActionPayload:
      | RequestCreateActionPayload
      | ProgressUpdate1RequestCreateActionPayload
      | ProgressUpdate2RequestCreateActionPayload = {
      payloadType: 'EMPTY_PAYLOAD',
    };

    switch (requestType) {
      case 'PROGRESS_UPDATE_1_P3':
        requestCreateActionPayload = {
          payloadType: 'PROGRESS_UPDATE_1_CREATE_ACTION_PAYLOAD',
          isDisaggregateUndertaking,
        };
        break;
      case 'PROGRESS_UPDATE_2_P3':
        requestCreateActionPayload = {
          payloadType: 'PROGRESS_UPDATE_2_CREATE_ACTION_PAYLOAD',
          isDisaggregateUndertaking,
        };
        break;
    }

    return requestCreateActionPayload;
  }
}
