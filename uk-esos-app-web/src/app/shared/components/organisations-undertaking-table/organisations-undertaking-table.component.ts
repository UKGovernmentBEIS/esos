import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { ButtonDirective, GovukTableColumn, LinkDirective, TableComponent } from 'govuk-components';

import { OrganisationUndertakingDetails } from 'esos-api';

@Component({
  selector: 'esos-organisations-undertaking-table',
  standalone: true,
  imports: [LinkDirective, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, RouterLink, TableComponent, ButtonDirective],
  templateUrl: './organisations-undertaking-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationsUndertakingTableComponent {
  @Input() header =
    'Provide the organisation names of the undertakings that either disaggregated from, or ceased to be part of the participant and which are not complying as if they were still a member of the participant';
  @Input() data: OrganisationUndertakingDetails[];
  @Input() isEditable = false;
  @Input() changeLink: string;
  @Input() queryParams: Params = {};
  @Output() readonly removeUndertakingOrganisation = new EventEmitter<number>();

  tableColumns: GovukTableColumn[] = [
    { field: 'organisationName', header: 'Organisation name', widthClass: 'govuk-!-width-one-third' },
    { field: 'registrationNumber', header: 'Company registration number' },
    { field: 'links', header: undefined },
  ];

  onRemove(index: number) {
    this.removeUndertakingOrganisation.emit(index);
  }
}
