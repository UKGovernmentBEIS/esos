import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ShowHideComponent } from '@shared/show-hide/show-hide.component';

import { ClassificationCodes } from 'esos-api';

@Component({
  selector: 'esos-show-activity-codes',
  standalone: true,
  imports: [ShowHideComponent, NgIf, NgForOf],
  template: `
    <esos-show-hide header="activity codes" [label]="organisationName" [itemIndex]="itemIndex">
      <p *ngIf="!sameAsRU; else same" class="govuk-body">
        <span *ngFor="let code of classificationCodes?.codes">
          <strong> {{ classificationCodes.otherTypeName ? classificationCodes.otherTypeName : 'SIC' }}: </strong>
          {{ code }}<br />
        </span>
      </p>
      <ng-template #same>
        <p class="govuk-body">Same as the RU's</p>
      </ng-template>
    </esos-show-hide>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowActivityCodesComponent {
  @Input() organisationName: string;
  @Input() classificationCodes: ClassificationCodes;
  @Input() sameAsRU = false;
  @Input() itemIndex: number;
}
