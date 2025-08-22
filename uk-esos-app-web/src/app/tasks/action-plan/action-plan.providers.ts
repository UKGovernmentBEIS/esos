import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { TaskService } from '@common/forms/services/task.service';
import { TaskApiService } from '@common/forms/services/task-api.service';
import { TaskStateService } from '@common/forms/services/task-state.service';
import { SIDE_EFFECTS } from '@common/forms/side-effects';
import { STEP_FLOW_MANAGERS } from '@common/forms/step-flow/step-flow.providers';
import { ActionPlanStateService } from '@tasks/action-plan/+state/action-plan-state.service';
import { ActionPlanService } from '@tasks/action-plan/services/action-plan.service';
import { ActionPlanApiService } from '@tasks/action-plan/services/action-plan-api.service';

import { ActionPlanSubmitStepFlowManager } from './submit/submit-step-flow-manager';
import { EnergyEfficiencyMeasuresSideEffect } from './subtasks/energy-efficiency-measures/energy-efficiency-measures-side-effect';
import { EnergyEfficiencyMeasuresStepFlowManager } from './subtasks/energy-efficiency-measures/energy-efficiency-measures-step-flow-manager';
import { ResponsibleOfficerConfirmationSideEffect } from './subtasks/responsible-officer-confirmation/responsible-officer-confirmation-side-effect';
import { ResponsibleOfficerConfirmationStepFlowManager } from './subtasks/responsible-officer-confirmation/responsible-officer-confirmation-step-flow-manager';

export function provideActionPlanTaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskStateService, useClass: ActionPlanStateService },
    { provide: TaskApiService, useClass: ActionPlanApiService },
    { provide: TaskService, useClass: ActionPlanService },
  ]);
}

export function provideActionPlanSideEffects(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SIDE_EFFECTS, multi: true, useClass: EnergyEfficiencyMeasuresSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: ResponsibleOfficerConfirmationSideEffect },
  ]);
}

export function provideActionPlanStepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: EnergyEfficiencyMeasuresStepFlowManager },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: ResponsibleOfficerConfirmationStepFlowManager },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: ActionPlanSubmitStepFlowManager },
  ]);
}
