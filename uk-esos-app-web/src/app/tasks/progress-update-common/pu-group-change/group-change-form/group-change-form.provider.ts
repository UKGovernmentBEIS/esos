import { inject } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { take } from 'rxjs';

import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { stringsMustNotMatchValidator } from '@shared/validators';
import { PROGRESS_UPDATE_COMMON_QUERY } from '@tasks/progress-update-common/+state';
import { TASK_FORM } from '@tasks/task-form.token';

import { OrganisationAccountViewService } from 'esos-api';

export const groupChangeFormProvider = {
  provide: TASK_FORM,
  deps: [UntypedFormBuilder, RequestTaskStore, OrganisationAccountViewService],
  useFactory: (
    fb: UntypedFormBuilder,
    store: RequestTaskStore,
    organisationAccountViewService: OrganisationAccountViewService,
  ) => {
    const puCommonQuery = inject(PROGRESS_UPDATE_COMMON_QUERY);
    const accountId = store.select(requestTaskQuery.selectRequestInfo)().accountId;
    const groupChange = store.select(puCommonQuery.selectGroupChange)();

    const otherResponsibleUndertakingName = fb.control(groupChange?.otherResponsibleUndertakingName ?? '');
    const otherResponsibleUndertakingCrn = fb.control(groupChange?.otherResponsibleUndertakingCrn ?? '');

    organisationAccountViewService
      .getOrganisationAccountById(accountId)
      .pipe(take(1))
      .subscribe((account) => {
        if (account?.name) {
          otherResponsibleUndertakingName.setValidators(
            stringsMustNotMatchValidator('The name must be different from the current account', account.name),
          );
          otherResponsibleUndertakingName.updateValueAndValidity();
        }
        if (account?.registrationNumber) {
          otherResponsibleUndertakingCrn.setValidators(
            stringsMustNotMatchValidator(
              'Company registration number must be different from the current account',
              account.registrationNumber,
            ),
          );
          otherResponsibleUndertakingCrn.updateValueAndValidity();
        }
      });

    return fb.group({
      otherResponsibleUndertakingName,
      otherResponsibleUndertakingCrn,
    });
  },
};
