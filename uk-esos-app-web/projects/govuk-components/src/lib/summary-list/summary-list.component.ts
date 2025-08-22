import { NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  HostBinding,
  Input,
  QueryList,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import {
  SummaryListColumnDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from './directives';
import { SummaryItem } from './summary-list.interface';

/*
  eslint-disable
  @angular-eslint/component-selector
 */
@Component({
  selector: 'dl[govuk-summary-list]',
  standalone: true,
  imports: [
    SummaryListRowKeyDirective,
    SummaryListRowDirective,
    NgForOf,
    NgIf,
    NgTemplateOutlet,
    SummaryListRowValueDirective,
  ],
  templateUrl: './summary-list.component.html',
  styleUrls: ['./summary-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class SummaryListComponent {
  @Input() details: SummaryItem[];
  @Input() hasBorders = true;

  @ContentChildren(SummaryListRowDirective) rows: QueryList<SummaryListRowDirective>;
  @ContentChildren(SummaryListColumnDirective) columns: QueryList<SummaryListColumnDirective>;
  @ContentChild('keyTemplate') keyTemplate: TemplateRef<any>;
  @ContentChild('valueTemplate') valueTemplate: TemplateRef<any>;

  @HostBinding('class.govuk-summary-list') readonly govukSummaryList = true;
  @HostBinding('class.govuk-!-margin-bottom-9') readonly bottomMargin = true;

  @HostBinding('class.govuk-summary-list--no-border') get govukSummaryListNoBorderClass(): boolean {
    return !this.hasBorders;
  }
}
