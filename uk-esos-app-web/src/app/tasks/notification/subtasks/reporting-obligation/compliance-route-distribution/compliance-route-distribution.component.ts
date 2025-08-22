import { ChangeDetectionStrategy, Component, computed, Inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { requestTaskQuery, RequestTaskStore } from '@common/request-task/+state';
import { WizardStepComponent } from '@shared/wizard/wizard-step.component';
import { TASK_FORM } from '@tasks/task-form.token';
import produce from 'immer';

import { DetailsComponent, LabelDirective, LinkDirective, TextInputComponent } from 'govuk-components';

import { NotificationTaskPayload } from '../../../notification.types';
import {
  REPORTING_OBLIGATION_CONTENT_MAP,
  REPORTING_OBLIGATION_SUBTASK,
  ReportingObligationStep,
} from '../reporting-obligation.helper';
import {
  ComplianceRouteDistributionFormModel,
  complianceRouteDistributionFormProvider,
} from './compliance-route-distribution-form.provider';

@Component({
  selector: 'esos-compliance-route-distribution',
  standalone: true,
  imports: [
    WizardStepComponent,
    TextInputComponent,
    ReactiveFormsModule,
    DetailsComponent,
    LabelDirective,
    LinkDirective,
  ],
  templateUrl: './compliance-route-distribution.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [complianceRouteDistributionFormProvider],
})
export class ComplianceRouteDistributionComponent {
  protected isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  protected contentMap = REPORTING_OBLIGATION_CONTENT_MAP;
  protected total = computed(() => {
    return Object.values(this.formValueAsSignal())
      .map((v) => (isNaN(v) ? 0 : +v))
      .reduce((acc, p) => acc + p, 0);
  });

  private formValueAsSignal = toSignal(this.form.valueChanges);

  constructor(
    @Inject(TASK_FORM) protected readonly form: FormGroup<ComplianceRouteDistributionFormModel>,
    private readonly store: RequestTaskStore,
    private readonly service: TaskService<NotificationTaskPayload>,
    private readonly route: ActivatedRoute,
  ) {}

  submit() {
    const { iso50001Pct, energyAuditsPct, energyNotAuditedPct, displayEnergyCertificatePct, greenDealAssessmentPct } =
      this.form.value;

    this.service.saveSubtask({
      subtask: REPORTING_OBLIGATION_SUBTASK,
      currentStep: ReportingObligationStep.COMPLIANCE_ROUTE_DISTRIBUTION,
      route: this.route,
      payload: produce(this.service.payload, (payload) => {
        payload.noc.reportingObligation.reportingObligationDetails.complianceRouteDistribution = {
          iso50001Pct: +iso50001Pct,
          energyAuditsPct: +energyAuditsPct,
          energyNotAuditedPct: +energyNotAuditedPct,
          displayEnergyCertificatePct: +displayEnergyCertificatePct,
          greenDealAssessmentPct: +greenDealAssessmentPct,
          totalPct: this.total(),
        };
      }),
      applySideEffects: false,
    });
  }
}
