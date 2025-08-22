import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest, first, map, of, switchMap } from 'rxjs';

import { catchBadRequest, ErrorCodes } from '@error/business-errors';
import { UserInputSummaryTemplateComponent } from '@shared/components/user-input-summary/user-input-summary.component';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PipesModule } from '@shared/pipes/pipes.module';
import { SummaryHeaderComponent } from '@shared/summary-header/summary-header.component';

import { ButtonDirective } from 'govuk-components';

import { OperatorUsersRegistrationService } from 'esos-api';

import { UserRegistrationStore } from '../store/user-registration.store';

@Component({
  selector: 'esos-summary',
  templateUrl: './summary.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    ButtonDirective,
    NgIf,
    PageHeadingComponent,
    PipesModule,
    SummaryHeaderComponent,
    UserInputSummaryTemplateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {
  userInfo$ = this.store.select('userRegistrationDTO');
  userEmail$ = this.store.select('email');

  isSubmitDisabled: boolean;

  constructor(
    private readonly store: UserRegistrationStore,
    private readonly operatorUsersRegistrationService: OperatorUsersRegistrationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  registerUser(): void {
    this.isSubmitDisabled = true;

    combineLatest([
      this.store.select('userRegistrationDTO'),
      this.store.select('isInvited'),
      this.store.select('token'),
    ])
      .pipe(
        first(),
        switchMap(([user, isInvited, emailToken]) =>
          isInvited
            ? this.operatorUsersRegistrationService.acceptOperatorInvitationAndRegister({
                operatorUserRegistrationDTO: user,
                invitationTokenDTO: { token: emailToken },
              })
            : this.operatorUsersRegistrationService.registerCurrentOperatorUser(user),
        ),
        map(() => ({ url: '../success' })),
        catchBadRequest([ErrorCodes.EMAIL1001], (res) =>
          of({ url: '../../invalid-link', queryParams: { code: res.error.code } }),
        ),
      )
      .subscribe(({ queryParams, url }: { url: string; queryParams?: any }) =>
        this.router.navigate([url], { relativeTo: this.route, queryParams }),
      );
  }
}
