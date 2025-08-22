import { NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { RelatedContentComponent } from '@shared/components/related-content/related-content.component';
import { TextLinkItem } from '@shared/interfaces';

import { LinkDirective } from 'govuk-components';

@Component({
  selector: 'esos-account-related-actions',
  standalone: true,
  imports: [RouterLink, LinkDirective, NgForOf, RelatedContentComponent],
  template: `
    <esos-related-content header="Related actions">
      <ul class="govuk-list govuk-!-font-size-16">
        <li *ngFor="let action of actionItems">
          <a [routerLink]="action.link" govukLink [relativeTo]="route">{{ action.text }}</a>
        </li>
      </ul>
    </esos-related-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountRelatedActionsComponent {
  @Input() actionItems: TextLinkItem[] = [];

  constructor(protected route: ActivatedRoute) {}
}
