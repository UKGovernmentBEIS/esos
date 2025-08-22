import { inject, Injectable } from '@angular/core';

import { SaveConfig } from '@common/forms/services/task.service';

import { AccountClosureStateService } from '../+state/account-closure-state.service';
import { AccountClosureTaskPayload } from '../account-closure.types';
import { AccountClosureStepFlowManager } from '../account-closure-step-flow-manager';
import { AccountClosureApiService } from './account-closure-api.service';

export type AccountClosureSaveConfig = SaveConfig<AccountClosureTaskPayload>;

@Injectable({ providedIn: 'root' })
export class AccountClosureTaskService {
  protected stateService = inject(AccountClosureStateService);
  protected apiService = inject(AccountClosureApiService);
  protected stepFlowManager = inject(AccountClosureStepFlowManager);

  save(config: AccountClosureSaveConfig): void {
    const { payload, currentStep, route } = config;

    this.stateService.stageForSave(payload);
    this.apiService.save(this.stateService.stagedChanges).subscribe(() => {
      this.stateService.setPayload(this.stateService.stagedChanges);
      this.stepFlowManager.nextStep(currentStep, route);
    });
  }

  get payload(): AccountClosureTaskPayload {
    return this.stateService.payload;
  }

  submit(config: Omit<AccountClosureSaveConfig, 'payload'>): void {
    const { currentStep, route } = config;

    this.apiService.submit().subscribe(() => this.stepFlowManager.nextStep(currentStep, route));
  }
}
