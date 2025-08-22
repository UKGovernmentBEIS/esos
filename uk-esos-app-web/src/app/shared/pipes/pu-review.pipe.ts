import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'puReview', standalone: true, pure: true })
export class ProgressUpdateReviewPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    switch (value) {
      case 'ESOS_ACTION_PLAN_COMPLIANCE':
        return 'the progress update has been produced following notification of an ESOS action plan and includes the content required by regulation 34B of the ESOS regulations.';
      case 'ESTIMATION_METHOD_DOCUMENTED':
        return 'where an estimate of the reduction in energy consumption is not based on an energy audit or estimate in the action plan, a description of the estimation method and reasons for using it are recorded in the evidence pack.';
      default:
        return null;
    }
  }
}
