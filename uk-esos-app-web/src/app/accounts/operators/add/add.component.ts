import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import {
  BehaviorSubject,
  catchError,
  combineLatest,
  EMPTY,
  map,
  Observable,
  shareReplay,
  switchMap,
  take,
  throwError,
} from 'rxjs';

import { ErrorCodes, isBadRequest } from '@error/business-errors';

import { GovukValidators } from 'govuk-components';

import { OperatorUsersInvitationService } from 'esos-api';

@Component({
  selector: 'esos-add',
  templateUrl: './add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddComponent {
  accountId$ = this.route.paramMap.pipe(map((paramMap) => Number(paramMap.get('accountId'))));
  userType$ = this.route.paramMap.pipe(map((paramMap) => paramMap.get('userType')));
  confirmAddedEmail$: Observable<string>;

  isSummaryDisplayed$ = new BehaviorSubject<boolean>(false);
  form: UntypedFormGroup = this.fb.group({
    firstName: [
      null,
      [
        GovukValidators.required(`Enter user's first name`),
        GovukValidators.maxLength(255, 'First name should not be more than 255 characters'),
      ],
    ],
    lastName: [
      null,
      [
        GovukValidators.required(`Enter user's last name`),
        GovukValidators.maxLength(255, 'Last name should not be more than 255 characters'),
      ],
    ],
    email: [
      null,
      [
        GovukValidators.required(`Enter user's email address`),
        GovukValidators.email('Enter an email address in the correct format, like name@example.com'),
        GovukValidators.maxLength(255, 'Email should not be more than 255 characters'),
      ],
    ],
  });

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly operatorUsersInvitationService: OperatorUsersInvitationService,
    private readonly route: ActivatedRoute,
  ) {}

  submitForm(): void {
    if (this.form.valid) {
      const email = this.form.get('email').value;
      this.confirmAddedEmail$ = combineLatest([this.accountId$, this.userType$]).pipe(
        take(1),
        switchMap(([accountId, userType]: [number, string]) =>
          this.operatorUsersInvitationService.inviteOperatorUserToAccount(Number(accountId), {
            email,
            firstName: this.form.get('firstName').value,
            lastName: this.form.get('lastName').value,
            roleCode: userType,
          }),
        ),
        catchError((res: unknown) => {
          if (isBadRequest(res)) {
            switch (res.error?.code) {
              case ErrorCodes.AUTHORITY1000:
              case ErrorCodes.AUTHORITY1005:
                this.form.get('email').setErrors({
                  emailExists: 'The email address of the new user must not already exist at your organisation',
                });
                break;
              case ErrorCodes.USER1001:
                this.form.get('email').setErrors({
                  emailExists: 'This email address is already linked to a non-organisation user account',
                });
                break;
              default:
                return throwError(() => res);
            }
            this.isSummaryDisplayed$.next(true);
            return EMPTY;
          } else {
            return throwError(() => res);
          }
        }),
        map(() => email),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    } else {
      this.isSummaryDisplayed$.next(true);
      this.form.markAllAsTouched();
    }
  }
}
