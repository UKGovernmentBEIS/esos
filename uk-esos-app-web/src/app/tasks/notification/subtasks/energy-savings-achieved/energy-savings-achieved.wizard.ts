import { EnergySavingsAchieved } from 'esos-api';

import { ReportingObligationCategory } from '../../../../requests/common/reporting-obligation-category.types';

export const isWizardCompleted = (
  energySavingsAchieved: EnergySavingsAchieved,
  reportingObligationCategory?: ReportingObligationCategory,
): boolean => {
  if (reportingObligationCategory === 'ISO_50001_COVERING_ENERGY_USAGE') {
    const totalEstimation = energySavingsAchieved?.totalEnergySavingsEstimation >= 0 ?? false;

    const recommendationsExist = energySavingsAchieved?.energySavingsRecommendationsExist;
    const recommendations = !!energySavingsAchieved?.energySavingsRecommendations;

    return (
      totalEstimation &&
      ((recommendationsExist && recommendations) || ['NO', 'SKIP_QUESTION'].includes(recommendationsExist))
    );
  } else {
    const estimation = !!energySavingsAchieved?.energySavingsEstimation;

    const categoriesExist = energySavingsAchieved?.energySavingCategoriesExist;
    const categories = !!energySavingsAchieved?.energySavingsCategories;

    const recommendationsExist = energySavingsAchieved?.energySavingsRecommendationsExist;
    const recommendations = !!energySavingsAchieved?.energySavingsRecommendations;

    return (
      estimation &&
      ((categoriesExist === 'YES' && categories) || ['NO', 'SKIP_QUESTION'].includes(categoriesExist)) &&
      ((recommendationsExist === 'YES' && recommendations) || ['NO', 'SKIP_QUESTION'].includes(recommendationsExist))
    );
  }
};
