import { NgIf } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GovukComponentsModule } from 'govuk-components';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'h2[esos-summary-header]',
  standalone: true,
  template: `
    <ng-content></ng-content>
    <a
      *ngIf="changeRoute"
      [routerLink]="changeRoute"
      (click)="changeClick.emit($event)"
      govukLink
      class="govuk-!-font-size-19 govuk-!-font-weight-regular float-right"
      [attr.aria-label]="ariaLabel"
    >
      Change
    </a>
  `,
  imports: [RouterLink, GovukComponentsModule, NgIf],
})
export class SummaryHeaderComponent {
  @Input() changeRoute: string | any[];
  @Input() ariaLabel: string;
  @Output() readonly changeClick = new EventEmitter<Event>();

  @HostBinding('class.govuk-clearfix') get clearfix() {
    return true;
  }
}
