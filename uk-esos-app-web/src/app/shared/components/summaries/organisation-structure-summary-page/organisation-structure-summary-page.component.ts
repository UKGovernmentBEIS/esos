import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Signal, signal } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { OrganisationStructureListTableComponent } from '@shared/components/organisations-structure-list-template/organisations-structure-list-template.component';
import { OrganisationStructureListTemplateViewModel } from '@shared/components/organisations-structure-list-template/organisations-structure-list-template.types';
import { OrganisationsUndertakingTableComponent } from '@shared/components/organisations-undertaking-table/organisations-undertaking-table.component';
import { OrganisationStructureViewModel } from '@shared/components/summaries';
import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';

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

import { OrganisationDetails, OrganisationStructure } from 'esos-api';

@Component({
  selector: 'esos-organisation-structure-summary-page',
  standalone: true,
  imports: [
    LinkDirective,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    NgIf,
    OrganisationStructureListTableComponent,
    RouterLink,
    BooleanToTextPipe,
    SummaryListColumnActionsDirective,
    SummaryListColumnDirective,
    SummaryListColumnValueDirective,
    OrganisationsUndertakingTableComponent,
    ButtonDirective,
  ],
  templateUrl: './organisation-structure-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationStructureSummaryPageComponent implements OnInit {
  @Input() vm: OrganisationStructureViewModel;
  @Input() organisationStructure: Signal<OrganisationStructure>;
  @Input() printMode = false;
  @Output() readonly removeOrganisationSummary = new EventEmitter<number>();
  @Output() readonly removeUndertakingOrganisationSummary = new EventEmitter<number>();

  vmList: Signal<OrganisationStructureListTemplateViewModel>;
  queryParams: Params;

  ngOnInit(): void {
    this.queryParams = this.vm.isEditable ? { change: true } : undefined;

    this.vmList = signal({
      header:
        "Add information on the organisations complying as one participant in the responsible undertaking's notification for its corporate group",
      isListPreviousPage: false,
      wizardStep: this.vm.wizardStep,
      isEditable: this.vm.isEditable,
      organisationDetails: this.vm.organisationDetails as OrganisationDetails,
    });
  }

  removeOrganisation(index: number) {
    this.removeOrganisationSummary.emit(index);
  }

  removeUndertakingOrganisation(index: number) {
    this.removeUndertakingOrganisationSummary.emit(index);
  }
}
