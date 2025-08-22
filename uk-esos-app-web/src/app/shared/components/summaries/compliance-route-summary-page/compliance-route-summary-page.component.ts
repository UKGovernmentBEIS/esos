import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Signal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EnergyAuditListComponent } from '@shared/components/energy-audit-list/energy-audit-list.component';
import { EnergyAuditListViewModel } from '@shared/components/energy-audit-list/energy-audit-list.types';
import { ComplianceRouteViewModel } from '@shared/components/summaries';
import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';
import { NotApplicablePipe } from '@shared/pipes/not-applicable.pipe';
import { SkipQuestionPipe } from '@shared/pipes/skip-question.pipe';

import {
  ButtonDirective,
  LinkDirective,
  SummaryListColumnActionsDirective,
  SummaryListColumnDirective,
  SummaryListColumnValueDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from 'govuk-components';

import { ComplianceRoute } from 'esos-api';

import { complianceRouteCalculationTypeMap } from './compliance-route.map';

@Component({
  selector: 'esos-compliance-route-summary-page',
  standalone: true,
  imports: [
    NgIf,
    EnergyAuditListComponent,
    RouterLink,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    BooleanToTextPipe,
    SkipQuestionPipe,
    LinkDirective,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    SummaryListColumnDirective,
    SummaryListColumnValueDirective,
    SummaryListColumnActionsDirective,
    ButtonDirective,
    NotApplicablePipe,
  ],
  templateUrl: './compliance-route-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplianceRouteSummaryPageComponent implements OnInit {
  @Input() vm: ComplianceRouteViewModel;
  @Input() complianceRoute: Signal<ComplianceRoute>;
  @Output() readonly removeEnergyAuditSummary = new EventEmitter<number>();

  vmList: Signal<EnergyAuditListViewModel>;
  complianceRouteCalculationTypeMap = complianceRouteCalculationTypeMap;

  ngOnInit(): void {
    this.vmList = signal({
      header: 'Add an energy audit',
      prefix: './',
      wizardStep: this.vm.wizardStep,
      isEditable: this.vm.isEditable,
    });
  }

  removeEnergyAudit(index: number) {
    this.removeEnergyAuditSummary.emit(index);
  }
}
