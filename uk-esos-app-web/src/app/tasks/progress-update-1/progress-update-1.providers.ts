import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { TaskService } from '@common/forms/services/task.service';
import { TaskApiService } from '@common/forms/services/task-api.service';
import { TaskStateService } from '@common/forms/services/task-state.service';
import { SIDE_EFFECTS } from '@common/forms/side-effects';
import { STEP_FLOW_MANAGERS } from '@common/forms/step-flow/step-flow.providers';
import { ProgressUpdate1StateService } from '@tasks/progress-update-1/+state/progress-update-1-state.service';
import { ProgressUpdate1Service } from '@tasks/progress-update-1/services/progress-update-1.service';
import { ProgressUpdate1ApiService } from '@tasks/progress-update-1/services/progress-update-1-api.service';
import {
  ProgressUpdateGroupChangeSideEffect,
  ProgressUpdateGroupChangeStepFlowManager,
} from '@tasks/progress-update-common/pu-group-change';
import {
  ProgressUpdateResponsibleOfficerConfirmationSideEffect,
  ProgressUpdateResponsibleOfficerConfirmationStepFlowManager,
} from '@tasks/progress-update-common/pu-responsible-officer-confirmation';

import { pu1CommonQueryProvider } from './+state/progress-update-1.selectors';
import { ProgressUpdate1SubmitStepFlowManager } from './submit/submit-step-flow-manager';
import { ProgressUpdate1EnergyEfficiencyMeasuresSideEffect } from './subtasks/pu1-energy-efficiency-measures/pu1-energy-efficiency-measures-side-effect';
import { ProgressUpdate1EnergyEfficiencyMeasuresStepFlowManager } from './subtasks/pu1-energy-efficiency-measures/pu1-energy-efficiency-measures-step-flow-manager';

export function provideProgressUpdate1TaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskStateService, useClass: ProgressUpdate1StateService },
    { provide: TaskApiService, useClass: ProgressUpdate1ApiService },
    { provide: TaskService, useClass: ProgressUpdate1Service },
    pu1CommonQueryProvider,
  ]);
}

export function provideProgressUpdate1SideEffects(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SIDE_EFFECTS, multi: true, useClass: ProgressUpdateGroupChangeSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: ProgressUpdate1EnergyEfficiencyMeasuresSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: ProgressUpdateResponsibleOfficerConfirmationSideEffect },
  ]);
}

export function provideProgressUpdate1StepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: ProgressUpdate1EnergyEfficiencyMeasuresStepFlowManager },
    {
      provide: STEP_FLOW_MANAGERS,
      multi: true,
      useClass: ProgressUpdateResponsibleOfficerConfirmationStepFlowManager,
    },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: ProgressUpdateGroupChangeStepFlowManager },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: ProgressUpdate1SubmitStepFlowManager },
  ]);
}
