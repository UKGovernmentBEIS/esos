import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, combineLatest, filter, first, map, Observable, shareReplay, switchMap, tap } from 'rxjs';

import { AuthStore, selectUserState } from '@core/store/auth';
import { BusinessErrorService } from '@error/business-error/business-error.service';
import { catchBadRequest, ErrorCodes } from '@error/business-errors';
import { CountyAddressInputComponent } from '@shared/county-address-input/county-address-input.component';
import { phoneInputValidators } from '@shared/phone-input/phone-input.validators';

import { GovukValidators } from 'govuk-components';

import { OperatorUserDTO, OperatorUsersService } from 'esos-api';

import { saveNotFoundOperatorError } from '../errors/business-error';

@Component({
  selector: 'esos-details',
  templateUrl: './details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent {
  userFullName: string;

  userId$ = this.activatedRoute.paramMap.pipe(map((parameters) => parameters.get('userId')));
  accountId$ = this.activatedRoute.paramMap.pipe(map((parameters) => Number(parameters.get('accountId'))));
  isLoggedUser$ = combineLatest([this.authStore.pipe(selectUserState), this.activatedRoute.paramMap]).pipe(
    first(),
    map(([userState, parameters]) => userState.userId === parameters.get('userId')),
  );
  form$: Observable<UntypedFormGroup> = this.activatedRoute.data.pipe(
    map(({ user }: { user: OperatorUserDTO }) => {
      this.userFullName = user.firstName + ' ' + user.lastName;

      return this.fb.group({
        firstName: [
          user.firstName,
          [
            GovukValidators.required('Enter your first name'),
            GovukValidators.maxLength(255, 'Your first name should not be larger than 255 characters'),
          ],
        ],
        lastName: [
          user.lastName,
          [
            GovukValidators.required('Enter your last name'),
            GovukValidators.maxLength(255, 'Your last name should not be larger than 255 characters'),
          ],
        ],
        jobTitle: [
          user.jobTitle,
          [
            GovukValidators.maxLength(255, 'Your job title should not be larger than 255 characters'),
          ],
        ],
        phoneNumber: [user.phoneNumber, [GovukValidators.empty('Enter your phone number'), ...phoneInputValidators]],
        mobileNumber: [user.mobileNumber, phoneInputValidators],
        email: [{ value: user.email, disabled: true }],
        address: this.fb.group(CountyAddressInputComponent.controlsFactory(user.address)),
      });
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
  isSummaryDisplayed = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly operatorService: OperatorUsersService,
    private readonly authStore: AuthStore,
    private readonly router: Router,
    private readonly businessErrorService: BusinessErrorService,
  ) {}

  onSubmit(): void {
    combineLatest([this.form$, this.authStore.pipe(selectUserState), this.activatedRoute.paramMap, this.accountId$])
      .pipe(
        first(),
        tap(([form]) => {
          if (!form.valid) {
            this.isSummaryDisplayed.next(true);
          }
        }),
        filter(([form]) => form.valid),
        switchMap(([form, { userId }, params, accountId]) => {
          const payload = {
            ...form.value,
            email: form.get('email').value,
            address: form.value.address,
          };
          return userId === params.get('userId')
            ? this.operatorService.updateCurrentOperatorUser(payload)
            : this.operatorService.updateOperatorUserById(accountId, params.get('userId'), payload);
        }),
        catchBadRequest(ErrorCodes.AUTHORITY1004, () =>
          this.accountId$.pipe(
            switchMap((accountId) => this.businessErrorService.showError(saveNotFoundOperatorError(accountId))),
          ),
        ),
      )
      .subscribe(() => this.router.navigate(['../..'], { fragment: 'users', relativeTo: this.activatedRoute }));
  }
}
