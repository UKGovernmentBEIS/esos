import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DaysRemainingPipe } from '@shared/pipes/days-remaining.pipe';

@Component({
  selector: 'esos-task-header-info',
  standalone: true,
  template: `
    <p class="govuk-body"><strong>Assigned to:</strong> {{ assignee ?? 'Unassigned' }}</p>

    @if (daysRemaining !== undefined && daysRemaining !== null) {
      <div class="govuk-!-margin-top-2">
        <p class="govuk-body"><strong>Days Remaining:</strong> {{ daysRemaining | daysRemaining }}</p>
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DaysRemainingPipe],
})
export class TaskHeaderInfoComponent {
  @Input() assignee: string;
  @Input() daysRemaining: number;
}
