import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { TaskService } from '@common/forms/services/task.service';
import { TaskApiService } from '@common/forms/services/task-api.service';
import { TaskStateService } from '@common/forms/services/task-state.service';
import { SIDE_EFFECTS } from '@common/forms/side-effects';
import { STEP_FLOW_MANAGERS } from '@common/forms/step-flow/step-flow.providers';
import { ProgressUpdate2StateService } from '@tasks/progress-update-2/+state/progress-update-2-state.service';
import { ProgressUpdate2Service } from '@tasks/progress-update-2/services/progress-update-2.service';
import { ProgressUpdate2ApiService } from '@tasks/progress-update-2/services/progress-update-2-api.service';
import {
  ProgressUpdateGroupChangeSideEffect,
  ProgressUpdateGroupChangeStepFlowManager,
} from '@tasks/progress-update-common/pu-group-change';
import {
  ProgressUpdateResponsibleOfficerConfirmationSideEffect,
  ProgressUpdateResponsibleOfficerConfirmationStepFlowManager,
} from '@tasks/progress-update-common/pu-responsible-officer-confirmation';

import { pu2CommonQueryProvider } from './+state/progress-update-2.selectors';
import { ProgressUpdate2SubmitStepFlowManager } from './submit/submit-step-flow-manager';
import { ProgressUpdate2EnergyEfficiencyMeasuresSideEffect } from './subtasks/pu2-energy-efficiency-measures/pu2-energy-efficiency-measures-side-effect';
import { ProgressUpdate2EnergyEfficiencyMeasuresStepFlowManager } from './subtasks/pu2-energy-efficiency-measures/pu2-energy-efficiency-measures-step-flow-manager';

export function provideProgressUpdate2TaskServices(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TaskStateService, useClass: ProgressUpdate2StateService },
    { provide: TaskApiService, useClass: ProgressUpdate2ApiService },
    { provide: TaskService, useClass: ProgressUpdate2Service },
    pu2CommonQueryProvider,
  ]);
}

export function provideProgressUpdate2SideEffects(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: SIDE_EFFECTS, multi: true, useClass: ProgressUpdateGroupChangeSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: ProgressUpdate2EnergyEfficiencyMeasuresSideEffect },
    { provide: SIDE_EFFECTS, multi: true, useClass: ProgressUpdateResponsibleOfficerConfirmationSideEffect },
  ]);
}

export function provideProgressUpdate2StepFlowManagers(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: ProgressUpdate2EnergyEfficiencyMeasuresStepFlowManager },
    {
      provide: STEP_FLOW_MANAGERS,
      multi: true,
      useClass: ProgressUpdateResponsibleOfficerConfirmationStepFlowManager,
    },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: ProgressUpdateGroupChangeStepFlowManager },
    { provide: STEP_FLOW_MANAGERS, multi: true, useClass: ProgressUpdate2SubmitStepFlowManager },
  ]);
}
