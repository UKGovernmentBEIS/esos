import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { InternalExternalPipe } from '@shared/pipes/internal-external.pipe';

import { GovukComponentsModule, GovukTableColumn } from 'govuk-components';

import { PersonnelDetails } from 'esos-api';

@Component({
  selector: 'esos-personnel-list-template',
  templateUrl: './personnel-list-template.component.html',
  standalone: true,
  imports: [GovukComponentsModule, InternalExternalPipe, NgSwitch, NgSwitchCase, NgIf, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonnelListTemplateComponent {
  @Input() personnel: PersonnelDetails[] = [];
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
  @Input() prefix = '../';

  columns: GovukTableColumn[] = [
    {
      header: 'Full name',
      field: 'fullName',
    },
    {
      header: 'Connection to the organisation',
      field: 'type',
    },
    {
      header: '',
      field: 'actions',
    },
  ];
}
