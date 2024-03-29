import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { of } from 'rxjs';

import { GovukValidators } from 'govuk-components';

import { UsersSecuritySetupService } from 'esos-api';

import { PendingRequestService } from '../../core/guards/pending-request.service';
import { PendingRequest } from '../../core/interfaces/pending-request.interface';
import { catchBadRequest, ErrorCodes } from '../../error/business-errors';

@Component({
  selector: 'esos-change-2fa',
  templateUrl: './change-2fa.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Change2faComponent implements PendingRequest {
  is2FaChanged = false;

  form = this.fb.group({
    password: [
      null,
      [
        GovukValidators.required('Enter the 6-digit code'),
        GovukValidators.pattern('[0-9]*', 'Digit code must contain numbers only'),
        GovukValidators.minLength(6, 'Digit code must contain exactly 6 characters'),
        GovukValidators.maxLength(6, 'Digit code must contain exactly 6 characters'),
      ],
    ],
  });

  constructor(
    readonly pendingRequest: PendingRequestService,
    private readonly router: Router,
    private readonly usersSecuritySetupService: UsersSecuritySetupService,
    private readonly fb: UntypedFormBuilder,
  ) {}

  onSubmit(): void {
    this.usersSecuritySetupService
      .requestTwoFactorAuthChange(this.form.value)
      .pipe(
        this.pendingRequest.trackRequest(),
        catchBadRequest(ErrorCodes.OTP1001, () => of('invalid-code')),
      )
      .subscribe((res) => {
        if (res === 'invalid-code') {
          this.router.navigate(['2fa', 'invalid-code']);
        } else {
          this.is2FaChanged = true;
        }
      });
  }
}
