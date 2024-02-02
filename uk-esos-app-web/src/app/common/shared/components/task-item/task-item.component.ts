import { I18nSelectPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { GovukComponentsModule } from 'govuk-components';

import { StatusTagColorPipe, StatusTagTextPipe } from '../../../request-task/pipes';

@Component({
  selector: 'li[esos-task-item]',
  template: `
    <span class="app-task-list__task-name" [class.govuk-!-margin-bottom-3]="hasContent">
      <a *ngIf="link; else plainText" [routerLink]="link" govukLink>{{ linkText }}</a>
      <ng-template #plainText>
        <span>{{ linkText }}</span>
      </ng-template>
    </span>
    <govuk-tag *ngIf="status" [color]="status | statusTagColor" class="app-task-list__tag">
      {{ status | statusTagText }}
    </govuk-tag>
    <ng-content></ng-content>
  `,
  standalone: true,
  imports: [GovukComponentsModule, RouterLink, StatusTagColorPipe, I18nSelectPipe, NgIf, StatusTagTextPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent {
  @Input() link: string;
  @Input() linkText: string;
  @Input() status: string;
  @Input() hasContent: boolean;

  @HostBinding('class.app-task-list__item') readonly taskListItem = true;
}
