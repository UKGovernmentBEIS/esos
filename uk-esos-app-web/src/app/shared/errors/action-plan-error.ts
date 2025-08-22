import { ActionPlanError } from '@tasks/action-plan/action-plan-errors/action-plan-errors';

const actionPlanErrorFactory = (errorFactory: () => ActionPlanError) => errorFactory();

export const actionPlanValidationError = actionPlanErrorFactory(() => new ActionPlanError(null));
