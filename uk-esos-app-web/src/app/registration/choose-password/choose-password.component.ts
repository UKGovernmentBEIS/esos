import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest, first, switchMap, takeUntil, tap } from 'rxjs';

import { DestroySubject } from '@core/services/destroy-subject.service';

import { OperatorUsersRegistrationService } from 'esos-api';

import { PASSWORD_FORM, passwordFormFactory } from '../../shared-user/password/password-form.factory';
import { UserRegistrationStore } from '../store/user-registration.store';

@Component({
  selector: 'esos-choose-password',
  templateUrl: './choose-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroySubject, passwordFormFactory],
})
export class ChoosePasswordComponent implements OnInit {
  isSummaryDisplayed = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly store: UserRegistrationStore,
    private readonly operatorUsersRegistrationService: OperatorUsersRegistrationService,
    private readonly destroy$: DestroySubject,
    @Inject(PASSWORD_FORM) readonly form: UntypedFormGroup,
  ) {}

  ngOnInit(): void {
    combineLatest([this.store.select('password'), this.store.select('email')])
      .pipe(
        takeUntil(this.destroy$),
        tap(([password, email]) => this.form.patchValue({ email, password, validatePassword: password })),
      )
      .subscribe();
  }

  submitPassword(): void {
    if (this.form.valid) {
      this.store.setState({ ...this.store.getState(), password: this.form.get('password').value, isSummarized: true });
      if (this.store.getState().invitationStatus === 'PENDING_USER_ENABLE') {
        combineLatest([this.store.select('token'), this.store.select('password')])
          .pipe(
            first(),
            switchMap(([token, password]) =>
              this.operatorUsersRegistrationService
                .enableOperatorInvitedUser({
                  invitationToken: token,
                  password: password,
                })
                .pipe(
                  switchMap(() => this.operatorUsersRegistrationService.acceptOperatorInvitation({ token: token })),
                ),
            ),
          )
          .subscribe(() =>
            this.router.navigate(['../success'], {
              relativeTo: this.route,
            }),
          );
      } else {
        this.router.navigate(['../summary'], {
          relativeTo: this.route,
        });
      }
    } else {
      this.isSummaryDisplayed = true;
    }
  }
}
