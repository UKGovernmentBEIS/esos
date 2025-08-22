import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'actionPlanReview', standalone: true, pure: true })
export class ActionPlanReviewPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    switch (value) {
      case 'ESOS_ASSESSMENT_NOTIFICATION':
        return 'the action plan has been produced following a notification of compliance for an ESOS assessment and includes the content required by regulation 34A of the ESOS regulations';
      case 'ESTIMATION_METHOD_DESCRIPTION':
        return 'where an estimate of the total energy saving reasonably expected to be achieved by implementing any measure is not based on an ESOS assessment (energy audit or alternative compliance method), a description of the estimation method and reasons for using it are recorded in the evidence pack';
      default:
        return null;
    }
  }
}
