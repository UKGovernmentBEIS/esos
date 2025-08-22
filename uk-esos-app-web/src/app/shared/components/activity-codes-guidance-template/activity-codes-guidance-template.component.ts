import { Component } from '@angular/core';

import { DetailsComponent, GovukTableColumn, LinkDirective, TableComponent } from 'govuk-components';

/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
@Component({
  selector: 'esos-activity-codes-guidance-template',
  standalone: true,
  imports: [LinkDirective, DetailsComponent, TableComponent],
  templateUrl: './activity-codes-guidance-template.component.html',
})
export class ActivityCodesGuidanceTemplateComponent {
  columns: GovukTableColumn[] = [
    { header: 'Division', field: 'division', widthClass: 'govuk-!-width-one-quarter' },
    { header: 'Group', field: 'group', widthClass: 'govuk-!-width-one-quarter' },
    { header: 'Class', field: 'class', widthClass: 'govuk-!-width-one-quarter' },
    { header: '(Sub-class)', field: 'subclass', widthClass: 'govuk-!-width-one-quarter' },
  ];

  data = [
    {
      division: 'Retail trade, except of motor vehicles and motorcycles',
      group: 'Retail sale of other goods in specialised store',
      class: 'Retail sale of second-hand goods in stores',
      subclass: 'Retail sale of second-hand goods (other than antiques and antique books) in stores',
    },
    {
      division: '47',
      group: '47.7',
      class: '47.79',
      subclass: '47.79/9',
    },
  ];
}
