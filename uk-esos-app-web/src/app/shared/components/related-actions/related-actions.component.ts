import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { RelatedContentComponent } from '@shared/components/related-content/related-content.component';
import { TextLinkItem } from '@shared/interfaces';

import { LinkDirective } from 'govuk-components';

import { RequestTaskActionProcessDTO } from 'esos-api';

import { requestTaskAllowedActions } from './request-task-allowed-actions.map';

@Component({
  selector: 'esos-related-actions',
  standalone: true,
  template: `
    <esos-related-content header="Related actions">
      <ul class="govuk-list govuk-!-font-size-16">
        <li *ngFor="let action of allActions">
          <a [routerLink]="action.link" govukLink [relativeTo]="route">{{ action.text }}</a>
        </li>
      </ul>
    </esos-related-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, RouterLink, LinkDirective, RelatedContentComponent],
})
export class RelatedActionsComponent implements OnChanges {
  @Input() isAssignable: boolean;
  @Input() taskId: number;
  @Input() allowedActions: Array<RequestTaskActionProcessDTO['requestTaskActionType']>;
  allActions: TextLinkItem[] = [];

  constructor(protected route: ActivatedRoute) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('taskId' in changes || 'allowedActions' in changes || 'isAssignable' in changes) {
      this.allActions = requestTaskAllowedActions(this.allowedActions, this.taskId);
      if (this.isAssignable) {
        this.allActions.unshift({ text: 'Reassign task', link: ['change-assignee'] });
      }
    }
  }
}
