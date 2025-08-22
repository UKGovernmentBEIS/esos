import { inject } from '@angular/core';

import { TaskStateService } from '@common/forms/services/task-state.service';
import { SideEffect } from '@common/forms/side-effects';
import { HIDDEN_SUBTASKS_MAP } from '@requests/common/notification-application';
import { determineReportingObligationCategory } from '@requests/common/reporting-obligation-category';
import { ReportingObligationCategory } from '@requests/common/reporting-obligation-category.types';
import { TaskItemStatus } from '@tasks/task-item-status';
import produce from 'immer';

import { NotificationStateService } from '../../+state/notification-state.service';
import { NotificationTaskPayload } from '../../notification.types';
import { REPORTING_OBLIGATION_SUBTASK } from './reporting-obligation.helper';

export class ReportingObligationSideEffect extends SideEffect {
  subtask = REPORTING_OBLIGATION_SUBTASK;
  private stateService = inject(TaskStateService);

  apply<T extends NotificationTaskPayload>(payload: T): T {
    const category = determineReportingObligationCategory(payload.noc.reportingObligation);
    const hiddenSubtasks = (HIDDEN_SUBTASKS_MAP[category] ?? [])
      .map((hs) => (typeof hs === 'string' ? hs : hs.isHidden(payload.noc) ? hs.subtask : null))
      .filter((hs) => !!hs);

    const updatedPayload = produce(payload, (p) => {
      hiddenSubtasks.forEach((subtask) => {
        delete p.noc[subtask];
        delete p.nocSectionsCompleted[subtask];
      });

      this.handleComplianceRoute(p, category);
      this.handleAlternativeRoutesToCompliance(p, category);
      this.handleConfirmations(p, category);
      this.handleEnergySavingsAchieved(p, category);
      this.handleEnergyConsumption(p, category);
    });

    (this.stateService as NotificationStateService).setLastReportingObligationCategory(category);
    return updatedPayload;
  }

  private handleComplianceRoute(payload: NotificationTaskPayload, category: ReportingObligationCategory) {
    const cdr = payload.noc.reportingObligation?.reportingObligationDetails?.complianceRouteDistribution;

    if (
      ['ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100', 'ISO_50001_COVERING_ENERGY_USAGE'].includes(category) ||
      (category === 'LESS_THAN_40000_KWH_PER_YEAR' && cdr.energyAuditsPct == 0)
    ) {
      delete payload.noc.complianceRoute?.areTwelveMonthsVerifiableDataUsed;
      delete payload.noc.complianceRoute?.twelveMonthsVerifiableDataUsedReason;
      delete payload.noc.complianceRoute?.energyConsumptionProfilingUsed;
      delete payload.noc.complianceRoute?.isEnergyConsumptionProfilingNotUsedRecorded;
      delete payload.noc.complianceRoute?.areEnergyConsumptionProfilingMethodsRecorded;
      delete payload.noc.complianceRoute?.energyAudits;
    }

    if (
      (['ESOS_ENERGY_ASSESSMENTS_95_TO_100', 'PARTIAL_ENERGY_ASSESSMENTS'].includes(category) ||
        (category === 'LESS_THAN_40000_KWH_PER_YEAR' && cdr.energyAuditsPct > 0)) &&
      (!payload.noc.complianceRoute?.areTwelveMonthsVerifiableDataUsed ||
        !payload.noc.complianceRoute?.energyConsumptionProfilingUsed ||
        !payload.noc.complianceRoute?.areEnergyConsumptionProfilingMethodsRecorded ||
        !payload.noc.complianceRoute?.isEnergyConsumptionProfilingNotUsedRecorded ||
        !payload.noc.complianceRoute?.energyAudits) &&
      payload.nocSectionsCompleted.complianceRoute === TaskItemStatus.COMPLETED
    ) {
      payload.nocSectionsCompleted.complianceRoute = TaskItemStatus.IN_PROGRESS;
    }
  }

  private handleAlternativeRoutesToCompliance(payload: NotificationTaskPayload, category: ReportingObligationCategory) {
    let changeStatusToInProgress = false;

    if (
      [
        'ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100',
        'PARTIAL_ENERGY_ASSESSMENTS',
        'LESS_THAN_40000_KWH_PER_YEAR',
      ].includes(category)
    ) {
      const cdr = payload.noc.reportingObligation?.reportingObligationDetails?.complianceRouteDistribution;

      if (cdr?.iso50001Pct === 0) {
        delete payload.noc.alternativeComplianceRoutes?.assets?.iso50001;
        delete payload.noc.alternativeComplianceRoutes?.iso50001CertificateDetails;
      }

      if (
        cdr?.iso50001Pct > 0 &&
        (!payload.noc.alternativeComplianceRoutes?.assets?.iso50001 ||
          !payload.noc.alternativeComplianceRoutes?.iso50001CertificateDetails) &&
        payload.nocSectionsCompleted.alternativeComplianceRoutes === TaskItemStatus.COMPLETED
      ) {
        changeStatusToInProgress = true;
      }

      if (cdr?.greenDealAssessmentPct === 0) {
        delete payload.noc.alternativeComplianceRoutes?.assets?.gda;
        delete payload.noc.alternativeComplianceRoutes?.gdaCertificatesDetails;
      }

      if (
        cdr?.greenDealAssessmentPct > 0 &&
        (!payload.noc.alternativeComplianceRoutes?.assets?.gda ||
          !payload.noc.alternativeComplianceRoutes?.gdaCertificatesDetails) &&
        payload.nocSectionsCompleted.alternativeComplianceRoutes === TaskItemStatus.COMPLETED
      ) {
        changeStatusToInProgress = true;
      }

      if (cdr?.displayEnergyCertificatePct === 0) {
        delete payload.noc.alternativeComplianceRoutes?.assets?.dec;
        delete payload.noc.alternativeComplianceRoutes?.decCertificatesDetails;
      }

      if (
        cdr?.displayEnergyCertificatePct > 0 &&
        (!payload.noc.alternativeComplianceRoutes?.assets?.dec ||
          !payload.noc.alternativeComplianceRoutes?.decCertificatesDetails) &&
        payload.nocSectionsCompleted.alternativeComplianceRoutes === TaskItemStatus.COMPLETED
      ) {
        changeStatusToInProgress = true;
      }
    }

    if (category === 'ISO_50001_COVERING_ENERGY_USAGE') {
      delete payload.noc.alternativeComplianceRoutes?.energyConsumptionReduction;
      delete payload.noc.alternativeComplianceRoutes?.energyConsumptionReductionCategories;
      delete payload.noc.alternativeComplianceRoutes?.gdaCertificatesDetails;
      delete payload.noc.alternativeComplianceRoutes?.assets?.gda;
      delete payload.noc.alternativeComplianceRoutes?.decCertificatesDetails;
      delete payload.noc.alternativeComplianceRoutes?.assets?.dec;

      if (
        (!payload.noc.alternativeComplianceRoutes?.iso50001CertificateDetails ||
          !payload.noc.alternativeComplianceRoutes?.assets?.iso50001) &&
        payload.nocSectionsCompleted.alternativeComplianceRoutes === TaskItemStatus.COMPLETED
      ) {
        changeStatusToInProgress = true;
      }
    }

    if (changeStatusToInProgress) {
      payload.nocSectionsCompleted.alternativeComplianceRoutes = TaskItemStatus.IN_PROGRESS;
    }
  }

  private handleConfirmations(payload: NotificationTaskPayload, category: ReportingObligationCategory) {
    const currentStatus = payload.nocSectionsCompleted.confirmations;
    let changeStatusToInProgress = false;

    if (
      [
        'ESOS_ENERGY_ASSESSMENTS_95_TO_100',
        'ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100',
        'PARTIAL_ENERGY_ASSESSMENTS',
        'LESS_THAN_40000_KWH_PER_YEAR',
      ].includes(category)
    ) {
      delete payload.noc.confirmations?.noEnergyResponsibilityAssessmentTypes;
    }

    if (category === 'ISO_50001_COVERING_ENERGY_USAGE') {
      delete payload.noc.confirmations?.noEnergyResponsibilityAssessmentTypes;
      delete payload.noc.confirmations?.secondResponsibleOfficerEnergyTypes;
      delete payload.noc.confirmations?.secondResponsibleOfficerDetails;
    }

    if (category === 'ZERO_ENERGY') {
      delete payload.noc.confirmations?.responsibilityAssessmentTypes;
      delete payload.noc.confirmations?.reviewAssessmentDate;
      delete payload.noc.confirmations?.secondResponsibleOfficerEnergyTypes;
      delete payload.noc.confirmations?.secondResponsibleOfficerDetails;

      if (
        !payload.noc.confirmations?.noEnergyResponsibilityAssessmentTypes &&
        payload.nocSectionsCompleted.confirmations === TaskItemStatus.COMPLETED
      ) {
        changeStatusToInProgress = true;
      }
    } else if (
      category !== 'NOT_QUALIFY' &&
      (!payload.noc.confirmations?.responsibilityAssessmentTypes || !payload.noc.confirmations?.reviewAssessmentDate) &&
      currentStatus === TaskItemStatus.COMPLETED
    ) {
      changeStatusToInProgress = true;
    }

    if (changeStatusToInProgress) {
      payload.nocSectionsCompleted.confirmations = TaskItemStatus.IN_PROGRESS;
    }
  }

  private handleEnergySavingsAchieved(payload: NotificationTaskPayload, category: ReportingObligationCategory) {
    if (
      [
        'ESOS_ENERGY_ASSESSMENTS_95_TO_100',
        'ALTERNATIVE_ENERGY_ASSESSMENTS_95_TO_100',
        'PARTIAL_ENERGY_ASSESSMENTS',
        'LESS_THAN_40000_KWH_PER_YEAR',
      ].includes(category)
    ) {
      delete payload.noc.energySavingsAchieved?.totalEnergySavingsEstimation;
    }

    if (
      category === 'ISO_50001_COVERING_ENERGY_USAGE' &&
      payload.nocSectionsCompleted.energySavingsAchieved === TaskItemStatus.COMPLETED
    ) {
      payload.nocSectionsCompleted.energySavingsAchieved = TaskItemStatus.IN_PROGRESS;
    }
  }

  private handleEnergyConsumption(payload: NotificationTaskPayload, category: ReportingObligationCategory) {
    const { energyNotAuditedPct } =
      payload.noc.reportingObligation?.reportingObligationDetails?.complianceRouteDistribution ?? {};
    const energyDetails = payload.noc.energyConsumptionDetails;
    const excludedCategories = ['ZERO_ENERGY', 'NOT_QUALIFY'];
    if (
      !excludedCategories.includes(category) &&
      energyNotAuditedPct > 0 &&
      energyDetails?.significantEnergyConsumptionExists === false
    ) {
      delete energyDetails.significantEnergyConsumptionExists;
      payload.nocSectionsCompleted.energyConsumptionDetails = TaskItemStatus.IN_PROGRESS;
    }
  }
}
