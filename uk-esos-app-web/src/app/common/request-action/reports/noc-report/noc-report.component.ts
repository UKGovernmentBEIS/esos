import { NgIf } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, Signal, signal } from '@angular/core';

import { RequestActionStore } from '@common/request-action/+state';
import { PersonnelListTemplateComponent } from '@shared/components/personnel-list-template/personnel-list-template.component';
import {
  AlternativeComplianceRoutesSummaryPageComponent,
  CompliancePeriodsSummaryPageComponent,
  ComplianceRouteSummaryPageComponent,
  ComplianceRouteViewModel,
  ConfirmationSummaryPageComponent,
  ContactPersonsSummaryPageComponent,
  EnergyConsumptionSummaryPageComponent,
  EnergySavingsAchievedSummaryPageComponent,
  EnergySavingsOpportunitiesSummaryPageComponent,
  LeadAssessorDetailsSummaryPageComponent,
  OrganisationStructureSummaryPageComponent,
  OrganisationStructureViewModel,
  ReportingObligationSummaryPageComponent,
  ResponsibleUndertakingSummaryPageComponent,
} from '@shared/components/summaries';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';
import { RequestActionReportService } from '@shared/services/request-action-report.service';
import {
  alternativeComplianceRoutesMap,
  energySavingsOpportunityMap,
  responsibleUndertakingMap,
} from '@shared/subtask-list-maps/subtask-list-maps';
import { SubTaskListMap } from '@shared/types';
import { WizardStep as CompliancePeriodWizardStep } from '@tasks/notification/subtasks/compliance-periods/shared/compliance-period.helper';
import { notificationApplicationTimelineQuery } from '@timeline/notification/+state/notification-application.selectors';

import {
  AlternativeComplianceRoutes,
  ComplianceRoute,
  EnergySavingsOpportunities,
  NocP3,
  OrganisationStructure,
  ResponsibleUndertaking,
} from 'esos-api';

interface ViewModel {
  requestId: string;
  submittedBy: string;
  creationDate: string;
  nocP3: NocP3;
  organisationStructureViewModel: OrganisationStructureViewModel;
  organisationStructure: Signal<OrganisationStructure>;
  complianceRouteViewModel: ComplianceRouteViewModel;
  complianceRoute: Signal<ComplianceRoute>;
  responsibleUndertakingMap: SubTaskListMap<ResponsibleUndertaking>;
  compliancePeriodWizardStep: { [p: string]: string };
  alternativeComplianceRoutesMap: SubTaskListMap<AlternativeComplianceRoutes>;
  energySavingsOpportunityMap: SubTaskListMap<EnergySavingsOpportunities>;
}

@Component({
  selector: 'esos-noc-report',
  templateUrl: './noc-report.component.html',
  standalone: true,
  imports: [
    NgIf,
    PageHeadingComponent,
    GovukDatePipe,
    ContactPersonsSummaryPageComponent,
    ReportingObligationSummaryPageComponent,
    ResponsibleUndertakingSummaryPageComponent,
    OrganisationStructureSummaryPageComponent,
    ComplianceRouteSummaryPageComponent,
    EnergyConsumptionSummaryPageComponent,
    EnergySavingsOpportunitiesSummaryPageComponent,
    AlternativeComplianceRoutesSummaryPageComponent,
    EnergySavingsAchievedSummaryPageComponent,
    LeadAssessorDetailsSummaryPageComponent,
    PersonnelListTemplateComponent,
    CompliancePeriodsSummaryPageComponent,
    ConfirmationSummaryPageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NocReportComponent implements AfterViewInit {
  vm: Signal<ViewModel> = computed(() => {
    const requestAction = this.store.select(notificationApplicationTimelineQuery.selectAction)();
    const nocP3 = this.store.select(notificationApplicationTimelineQuery.selectNoc)();
    const organisationDetailsRu = nocP3?.responsibleUndertaking?.organisationDetails;
    const organisationDetailsOriginatedData = this.store.select(
      notificationApplicationTimelineQuery.selectAccountOriginatedData,
    )()?.organisationDetails;

    return {
      requestId: requestAction.requestId,
      submittedBy: requestAction.submitter,
      creationDate: requestAction.creationDate,
      nocP3: nocP3,
      organisationStructureViewModel: {
        data: nocP3?.organisationStructure,
        organisationDetails: organisationDetailsRu?.name ? organisationDetailsRu : organisationDetailsOriginatedData,
        isEditable: false,
      },
      organisationStructure: signal(nocP3?.organisationStructure),
      complianceRouteViewModel: {
        data: nocP3?.complianceRoute,
        isEditable: false,
      },
      complianceRoute: signal(nocP3?.complianceRoute),
      responsibleUndertakingMap: responsibleUndertakingMap,
      compliancePeriodWizardStep: CompliancePeriodWizardStep,
      alternativeComplianceRoutesMap: alternativeComplianceRoutesMap,
      energySavingsOpportunityMap: energySavingsOpportunityMap,
    };
  });

  constructor(
    private readonly requestActionReportService: RequestActionReportService,
    private readonly store: RequestActionStore,
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.requestActionReportService.print('Phase 3 notification of compliance');
    }, 500);
  }
}
