import { hasOtherEstimationMethod } from '@tasks/action-plan/action-plan-task-content';

import { ActionPlanP3 } from 'esos-api';

export const isWizardCompleted = (actionPlan: ActionPlanP3) => {
  const requiredConfirmations = hasOtherEstimationMethod(actionPlan.energyEfficiencyMeasure.energyEfficiencyMeasures)
    ? 2
    : 1;

  return actionPlan.responsibleOfficerConfirmation?.length === requiredConfirmations;
};
