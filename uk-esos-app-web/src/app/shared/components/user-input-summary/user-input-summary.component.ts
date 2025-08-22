import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

import { PipesModule } from '@shared/pipes/pipes.module';

import { GovukComponentsModule } from 'govuk-components';

import { OperatorUserRegistrationDTO } from 'esos-api';

import { ContactPersonWithoutEmailDTO } from '../summaries';

@Component({
  selector: 'esos-user-input-summary-template',
  standalone: true,
  imports: [GovukComponentsModule, NgIf, PipesModule, RouterLink],
  templateUrl: './user-input-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserInputSummaryTemplateComponent {
  @Input() userInfo: OperatorUserRegistrationDTO | ContactPersonWithoutEmailDTO;
  @Input() userEmail: string;
  @Input() changeLink: string;
  @Input() canChangeEmail: boolean;

  changeQueryParams: Params = { change: true };

  constructor(readonly route: ActivatedRoute) {}
}
