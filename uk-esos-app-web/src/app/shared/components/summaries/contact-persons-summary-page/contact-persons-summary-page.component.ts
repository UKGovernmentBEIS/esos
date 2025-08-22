import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { UserInputSummaryTemplateComponent } from '@shared/components/user-input-summary/user-input-summary.component';
import { BooleanToTextPipe } from '@shared/pipes/boolean-to-text.pipe';

import {
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

import { ContactPerson, ContactPersons, CountyAddressDTO, PhoneNumberDTO } from 'esos-api';

export interface ContactPersonWithoutEmailDTO {
  firstName: string;
  lastName: string;
  jobTitle?: string;
  phoneNumber?: PhoneNumberDTO;
  mobileNumber?: PhoneNumberDTO;
  address: CountyAddressDTO;
}

@Component({
  selector: 'esos-contact-persons-summary-page',
  standalone: true,
  imports: [
    LinkDirective,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    SummaryListColumnDirective,
    SummaryListColumnValueDirective,
    SummaryListColumnActionsDirective,
    NgIf,
    RouterLink,
    UserInputSummaryTemplateComponent,
    BooleanToTextPipe,
  ],
  templateUrl: './contact-persons-summary-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPersonsSummaryPageComponent {
  @Input() data: ContactPersons;
  @Input() isEditable = false;
  @Input() changeLink: { [s: string]: string };
  @Input() queryParams: Params = {};

  toDTO(contactPerson: ContactPerson): ContactPersonWithoutEmailDTO {
    const { line1, line2, city, county, postcode, ...rest } = contactPerson;

    return {
      ...rest,
      address: {
        line1,
        line2,
        city,
        county,
        postcode,
      },
    };
  }
}
