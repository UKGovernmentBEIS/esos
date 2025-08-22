import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RequestTaskStore } from '../../request-task/+state';

/**
 * A manager class for handling differentiated wizard form flows inside a subtask
 *
 * @example
 * // @Injectable
 * class SampleSubtaskStepFlowManager extends StepFlowManager {
 *   override subtask = 'sample-subtask';
 *
 *   override resolveNextStepRoute(currentStep: string): string {
 *     switch (currentStep) {
 *       case 'first-step':
 *         return 'second-step';
 *       case 'second-step':
 *         return this.resolveSecondStepNavigation();
 *       default:
 *         return 'first-step';
 *     }
 *   }
 *
 *   private resolveSecondStepRoute(): string {
 *     const secondStepAnswer = this.store.select(selector);
 *     if (secondStepAnswer === 'yes') {
 *       return 'third-step';
 *     } else {
 *       return 'fourth-step';
 *     }
 *   }
 * }
 */
export abstract class StepFlowManager {
  abstract subtask: string;
  protected store = inject(RequestTaskStore);
  protected router = inject(Router);

  nextStep(currentStep: string, route: ActivatedRoute, data?: any): void {
    this.router.navigate([this.resolveNextStepRoute(currentStep)], {
      ...(data ? { state: data } : undefined),
      relativeTo: route,
    });
  }

  abstract resolveNextStepRoute(currentStep: string): string;
}
