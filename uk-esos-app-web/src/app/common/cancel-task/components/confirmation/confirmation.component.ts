import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BaseSuccessComponent } from '@shared/base-success/base-success.component';

import { GovukComponentsModule } from 'govuk-components';

@Component({
  selector: 'esos-cancel-confirmation',
  standalone: true,
  template: `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <govuk-panel><h1 class="govuk-panel__title">Task cancelled</h1></govuk-panel>
        <p class="govuk-body">It has been removed from your task dashboard.</p>
        <a govukLink routerLink="/dashboard">Return to dashboard</a>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GovukComponentsModule, RouterLink, AsyncPipe],
})
export class ConfirmationComponent extends BaseSuccessComponent {}
