import { isAfter } from 'date-fns';

import { Confirmations } from 'esos-api';

import { ReportingObligationCategory } from '../../../../requests/common/reporting-obligation-category.types';
import { reviewAssessmentCannotBeBefore } from './confirmation.helper';

export const isWizardCompleted = (
  confirmations: Confirmations,
  reportingObligationCategory: ReportingObligationCategory,
  leadAssessorType?: string,
) => {
  const isResponsibilityAssessmentTypesCompleted = !!confirmations?.responsibilityAssessmentTypes;

  const isNoEnergyResponsibilityAssessmentTypesCompleted = !!confirmations?.noEnergyResponsibilityAssessmentTypes;

  const isResponsibleOfficerDetailsCompleted = !!confirmations?.responsibleOfficerDetails;

  const isReviewAssessmentDateCompleted =
    !!confirmations?.reviewAssessmentDate &&
    isAfter(new Date(confirmations?.reviewAssessmentDate), reviewAssessmentCannotBeBefore);

  const isSecondResponsibleOfficerDetailsCompleted =
    (!!confirmations?.secondResponsibleOfficerDetails &&
      confirmations?.secondResponsibleOfficerDetails?.email !== confirmations?.responsibleOfficerDetails?.email) ||
    (!leadAssessorType && reportingObligationCategory != 'LESS_THAN_40000_KWH_PER_YEAR') ||
    leadAssessorType === 'EXTERNAL';

  const isSecondResponsibleOfficerEnergyTypesCompleted =
    !!confirmations?.secondResponsibleOfficerEnergyTypes ||
    (!leadAssessorType && reportingObligationCategory != 'LESS_THAN_40000_KWH_PER_YEAR') ||
    leadAssessorType === 'EXTERNAL';

  switch (reportingObligationCategory) {
    case 'ESOS_ENERGY_ASSESSMENTS_95_TO_100':
    case 'PARTIAL_ENERGY_ASSESSMENTS':
    case 'LESS_THAN_40000_KWH_PER_YEAR':
    case 'ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100':
      return (
        isResponsibilityAssessmentTypesCompleted &&
        isResponsibleOfficerDetailsCompleted &&
        isReviewAssessmentDateCompleted &&
        isSecondResponsibleOfficerEnergyTypesCompleted &&
        isSecondResponsibleOfficerDetailsCompleted
      );

    case 'ISO_50001_COVERING_ENERGY_USAGE':
      return (
        isResponsibilityAssessmentTypesCompleted &&
        isResponsibleOfficerDetailsCompleted &&
        isReviewAssessmentDateCompleted
      );

    case 'ZERO_ENERGY':
      return isNoEnergyResponsibilityAssessmentTypesCompleted && isResponsibleOfficerDetailsCompleted;
  }
};
