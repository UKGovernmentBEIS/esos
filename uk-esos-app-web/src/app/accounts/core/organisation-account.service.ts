import { Injectable } from '@angular/core';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { OrganisationAccountStore } from '@accounts/organisation-account-application/+state';
import { OrganisationAccountOpeningApplicationState } from '@accounts/organisation-account-application/+state';
import { PendingRequestService } from '@core/guards/pending-request.service';
import { BusinessErrorService } from '@error/business-error/business-error.service';
import { ErrorCode } from '@error/not-found-error';
import { taskNotFoundError } from '@shared/errors/request-task-error';
import cleanDeep from 'clean-deep';

import { OrganisationAccountPayload, RequestCreateActionProcessDTO, RequestsService } from 'esos-api';

@Injectable({ providedIn: 'root' })
export class OrganisationAccountService {
  constructor(
    readonly store: OrganisationAccountStore,
    readonly requestsService: RequestsService,
    readonly businessErrorService: BusinessErrorService,
    readonly pendingRequestService: PendingRequestService,
  ) {}

  submitSummary() {
    const state = this.store.state;
    const payload = this.mapToSubmitPayload(state);
    return this.requestsService.processRequestCreateAction(payload).pipe(
      catchError((err) => {
        if (err.code === ErrorCode.NOTFOUND1001) {
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError);
        }
        return throwError(err);
      }),
      this.pendingRequestService.trackRequest(),
    );
  }

  protected mapToSubmitPayload(state: OrganisationAccountOpeningApplicationState): RequestCreateActionProcessDTO {
    return {
      requestCreateActionPayload: cleanDeep(
        this.mapApplication(state, 'ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION_PAYLOAD'),
      ),
      requestCreateActionType: 'ORGANISATION_ACCOUNT_OPENING_SUBMIT_APPLICATION',
    };
  }

  protected mapApplication(state: OrganisationAccountOpeningApplicationState, payloadType: string): any {
    return {
      payloadType: payloadType,
      registrationNumber: state.registrationNumber,
      name: state.name,
      competentAuthority: state.competentAuthority,
      line1: state.address.line1,
      line2: state.address.line2 || null,
      city: state.address.city,
      county: state.address.county,
      postcode: state.address.postcode,
      type: state.type,
      otherTypeName: state.otherTypeName,
      codes: state.codes,
    };
  }

  get payload(): OrganisationAccountPayload {
    const state = this.store.state;
    return {
      registrationNumber: state?.registrationNumber,
      name: state.name,
      competentAuthority: state.competentAuthority,
      line1: state.address.line1,
      line2: state.address.line2,
      city: state.address.city,
      county: state.address.county,
      postcode: state.address.postcode,
      type: state.type,
      otherTypeName: state.otherTypeName,
      codes: state.codes,
    };
  }
}
