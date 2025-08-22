import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { TaskService, TaskServiceExtended } from '@common/forms/services/task.service';
import { TaskApiService, TaskApiServiceExtended } from '@common/forms/services/task-api.service';
import { TaskStateService } from '@common/forms/services/task-state.service';
import { SIDE_EFFECTS } from '@common/forms/side-effects';
import { STEP_FLOW_MANAGERS } from '@common/forms/step-flow/step-flow.providers';
import { NotificationStateService } from '@tasks/notification/+state/notification-state.service';
import { ReturnToSubmitStepFlowManager } from '@tasks/notification/return-to-submit/return-to-submit-step-flow-manager';
import { SendToRestrictedStepFlowManager } from '@tasks/notification/send-to-restricted/send-to-restricted-step-flow-manager';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { NotificationApiService } from '@tasks/notification/services/notification-api.service';
import { AlternativeComplianceRoutesStepFlowManager } from '@tasks/notification/subtasks/alternative-compliance-routes/alternative-compliance-routes-step-flow-manager';
import { FirstCompliancePeriodSideEffect } from '@tasks/notification/subtasks/compliance-periods/first-compliance-period/first-compliance-period-side-effect';
import { FirstCompliancePeriodStepFlowManager } from '@tasks/notification/subtasks/compliance-periods/first-compliance-period/first-compliance-period-step-flow-manager';
import { SecondCompliancePeriodSideEffect } from '@tasks/notification/subtasks/compliance-periods/second-compliance-period/second-compliance-period-side-effect';
import { SecondCompliancePeriodStepFlowManager } from '@tasks/notification/subtasks/compliance-periods/second-compliance-period/second-compliance-period-step-flow-manager';
import { EnergyConsumptionSideEffect } from '@tasks/notification/subtasks/energy-consumption/energy-consumption-side-effect';
import { EnergyConsumptionStepFlowManager } from '@tasks/notification/subtasks/energy-consumption/energy-consumption-step-flow-manager';
import { OrganisationStructureSideEffect } from '@tasks/notification/subtasks/organisation-structure/organisation-structure-side-effect';

import { NotificationSubmitStepFlowManager } from './submit/submit-step-flow-manager';
import { AssessmentPersonnelStepFlowManager } from './subtasks/assessment-personnel/assessment-personnel-step-flow-manager';
import { ComplianceRouteSideEffect } from './subtasks/compliance-route/compliance-route-side-effect';
import { ComplianceRouteStepFlowManager } from './subtasks/compliance-route/compliance-route-step-flow-manager';
import { ConfirmationStepFlowManager } from './subtasks/confirmation/confirmation-step-flow-manager';
import { ContactPersonsSideEffect } from './subtasks/contact-persons/contact-persons-side-effect';
import { ContactPersonsStepFlowManager } from './subtasks/contact-persons/contact-persons-step-flow-manager';
import { EnergySavingsAchievedSideEffect } from './subtasks/energy-savings-achieved/energy-savings-achieved-side-effects';
import { EnergySavingsAchievedStepFlowManager } from './subtasks/energy-savings-achieved/energy-savings-achieved-step-flow-manager';
import { EnergySavingsOpportunityStepFlowManager } from './subtasks/energy-savings-opportunity/energy-savings-opportunity-step-flow-manager';
import { LeadAssessorDetailsSideEffect } from './subtasks/lead-assessor-details/lead-assessor-details-side-effect';
import { LeadAssessorDetailsFlowManager } from './subtasks/lead-assessor-details/lead-assessor-details-step-flow-manager';
import { OrganisationStructureStepFlowManager } from './subtasks/organisation-structure/organisation-structure-step-flow-manager';
import { ReportingObligationSideEffect } from './subtasks/reporting-obligation/reporting-obligation-side-effect';
import { ReportingObligationStepFlowManager } from './subtasks/reporting-obligation/reporting-obligation-step-flow-manager';
import { ResponsibleUndertakingSideEffect } from './subtasks/responsible-undertaking/responsible-undertaking-side-effect';
import { ResponsibleUndertakingStepFlowManager } from './subtasks/responsible-undertaking/responsible-undertaking-step-flow-manager';

export function provideNotificationTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskStateService, useClass: NotificationStateService },
    { provide: TaskApiService, useClass: NotificationApiService },
    { provide: TaskApiServiceExtended, useClass: NotificationApiService },
    { provide: TaskService, useClass: NotificationService },
    { provide: TaskServiceExtended, useClass: NotificationService },
  ]);
}

export function provideNotificationSideEffects(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SIDE_EFFECTS, multi: true, useClass: ReportingObligationSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: ResponsibleUndertakingSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: EnergySavingsAchievedSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: EnergyConsumptionSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: FirstCompliancePeriodSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: SecondCompliancePeriodSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: ComplianceRouteSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: LeadAssessorDetailsSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: ContactPersonsSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: OrganisationStructureSideEffect },
  ]);
}

export function provideNotificationStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: ReportingObligationStepFlowManager },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: ResponsibleUndertakingStepFlowManager },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: ContactPersonsStepFlowManager },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: AssessmentPersonnelStepFlowManager },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: EnergySavingsAchievedStepFlowManager },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: LeadAssessorDetailsFlowManager },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: OrganisationStructureStepFlowManager },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: EnergySavingsOpportunityStepFlowManager },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: FirstCompliancePeriodStepFlowManager },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: SecondCompliancePeriodStepFlowManager },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: EnergyConsumptionStepFlowManager },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: ComplianceRouteStepFlowManager },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: ReturnToSubmitStepFlowManager },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: SendToRestrictedStepFlowManager },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: ConfirmationStepFlowManager },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: AlternativeComplianceRoutesStepFlowManager },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: NotificationSubmitStepFlowManager },
  ]);
}
