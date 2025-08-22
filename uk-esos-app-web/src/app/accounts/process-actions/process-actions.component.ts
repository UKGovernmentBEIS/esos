import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { map, Observable, switchMap, withLatestFrom } from 'rxjs';

import { AuthStore, selectUserRoleType } from '@core/store/auth';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { AccountStatusPipe } from '@shared/pipes/account-status.pipe';

import { ButtonDirective, LinkDirective } from 'govuk-components';

import {
  AccountStatus,
  OrganisationAccountDTO,
  RequestCreateActionProcessDTO,
  RequestCreateValidationResult,
  RequestsService,
  UserStateDTO,
} from 'esos-api';

import { AboutActionPlanP3DescriptionComponent } from './about-action-plan-p3-description/about-action-plan-p3-description.component';
import { AboutNocP3DescriptionComponent } from './about-noc-p3-description/about-noc-p3-description.component';
import { AboutProgressUpdate1P3DescriptionComponent } from './about-progress-update-1-p3-description/about-progress-update-1-p3-description.component';
import { AboutProgressUpdate2P3DescriptionComponent } from './about-progress-update-2-p3-description/about-progress-update-2-p3-description.component';
import { ProcessActionsService } from './process-actions.service';
import { processActionsDetailsTypesMap, WorkflowLabel, WorkflowMap } from './process-actions-map';

@Component({
  selector: 'esos-process-actions',
  templateUrl: './process-actions.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    PageHeadingComponent,
    PendingButtonDirective,
    ButtonDirective,
    LinkDirective,
    RouterLink,
    AboutNocP3DescriptionComponent,
    AboutActionPlanP3DescriptionComponent,
    AboutProgressUpdate1P3DescriptionComponent,
    AboutProgressUpdate2P3DescriptionComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessActionsComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly requestsService = inject(RequestsService);
  private readonly authStore = inject(AuthStore);
  private readonly processActionsService = inject(ProcessActionsService);

  accountId$ = this.activatedRoute.paramMap.pipe(map((parameters) => parameters.get('accountId')));

  availableTasks$: Observable<WorkflowLabel[]> = this.accountId$.pipe(
    switchMap((accountId) => this.requestsService.getAvailableAccountWorkflows(+accountId)),
    withLatestFrom(
      this.authStore.pipe(
        selectUserRoleType,
        map((roleType) => this.userRoleWorkflowsMap[roleType]),
      ),
    ),
    map(([validationResults, userRoleWorkflowMessagesMap]) =>
      Object.entries(validationResults)
        .filter(([type]) => userRoleWorkflowMessagesMap[type])
        .map(([_type, result]) => {
          const type = _type as RequestCreateActionProcessDTO['requestCreateActionType'];
          return {
            ...userRoleWorkflowMessagesMap[type],
            type: type,
            errors: this.showErrorMessages(type, result) ? this.createErrorMessages(type, result) : undefined,
            showDisaggregatedTriggerPoint: this.showDisaggregatedTriggerPoint(type, result),
          };
        })
        .sort((a, b) => a.order - b.order),
    ),
  );

  private operatorsWorkflowMessagesMap: Partial<WorkflowMap> = {
    NOTIFICATION_OF_COMPLIANCE_P3: {
      title: 'Phase 3 Notification',
      button: 'Start',
      order: 0,
    },
    ACTION_PLAN_P3: {
      title: 'Phase 3 Action Plan',
      button: 'Start',
      order: 1,
    },
    PROGRESS_UPDATE_1_P3: {
      title: 'Phase 3 Progress Update 1',
      button: 'Start',
      order: 2,
      disaggregatedTriggerPointText: 'I want to start Progress Update 1 as disaggregated undertaking',
    },
    PROGRESS_UPDATE_2_P3: {
      title: 'Phase 3 Progress Update 2',
      button: 'Start',
      order: 3,
      disaggregatedTriggerPointText: 'I want to start Progress Update 2 as disaggregated undertaking',
    },
  };

  private regulatorsWorkflowMessagesMap: Partial<WorkflowMap> = {
    ACCOUNT_CLOSURE: {
      title: 'Account closure',
      button: 'Start account closure',
      order: 0,
    },
  };

  private userRoleWorkflowsMap: Record<UserStateDTO['roleType'], Partial<WorkflowMap>> = {
    OPERATOR: this.operatorsWorkflowMessagesMap,
    REGULATOR: this.regulatorsWorkflowMessagesMap,
    VERIFIER: undefined,
  };

  onRequestButtonClick(requestType: RequestCreateActionProcessDTO['requestCreateActionType'], accountId: number) {
    this.processActionsService.processRequestCreateAction({ requestType, accountId });
  }

  private showErrorMessages(
    type: RequestCreateActionProcessDTO['requestCreateActionType'],
    result: RequestCreateValidationResult,
  ): boolean {
    return !result.valid || this.showDisaggregatedTriggerPoint(type, result);
  }

  private showDisaggregatedTriggerPoint(
    type: RequestCreateActionProcessDTO['requestCreateActionType'],
    result: RequestCreateValidationResult,
  ): boolean {
    switch (type) {
      case 'PROGRESS_UPDATE_1_P3':
        return result.valid && !!result.requests?.includes('ACTION_PLAN_P3');
      case 'PROGRESS_UPDATE_2_P3':
        return result.valid && !!result.requests?.includes('PROGRESS_UPDATE_1_P3');
      default:
        return false;
    }
  }

  private createErrorMessages(
    currentRequestType: RequestCreateActionProcessDTO['requestCreateActionType'],
    result: RequestCreateValidationResult,
  ): string[] {
    const status = result?.accountStatus as unknown as OrganisationAccountDTO['status'];
    const typeString = processActionsDetailsTypesMap[currentRequestType];

    if (status && !result?.applicableAccountStatuses?.includes(status as AccountStatus)) {
      const accountStatusString = new AccountStatusPipe().transform(status)?.toUpperCase();

      return [`You cannot start the ${typeString} while the account status is ${accountStatusString}.`];
    } else if (result.requests?.length) {
      return result.requests.map((blockingRequestType) =>
        this.createErrorMessage(
          currentRequestType,
          blockingRequestType as RequestCreateActionProcessDTO['requestCreateActionType'],
        ),
      );
    } else {
      return [`You cannot start the ${typeString}.`];
    }
  }

  private createErrorMessage(
    currentRequestType: RequestCreateActionProcessDTO['requestCreateActionType'],
    blockingRequestType: RequestCreateActionProcessDTO['requestCreateActionType'],
  ): string {
    const currentRequestTypeString = processActionsDetailsTypesMap[currentRequestType];
    const blockingRequestTypeString = processActionsDetailsTypesMap[blockingRequestType];

    if (currentRequestType === blockingRequestType) {
      return `You cannot start the ${currentRequestTypeString} process as it is already in progress or has been completed.`;
    } else {
      return `You cannot start the ${currentRequestTypeString} if you haven't submitted the ${blockingRequestTypeString}.`;
    }
  }
}
