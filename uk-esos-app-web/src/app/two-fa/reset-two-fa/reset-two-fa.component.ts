import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';

import { GovukValidators } from 'govuk-components';

import { UsersSecuritySetupService } from 'esos-api';

@Component({
  selector: 'esos-reset-two-fa',
  templateUrl: './reset-two-fa.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetTwoFaComponent {
  isSummaryDisplayed$ = new BehaviorSubject<boolean>(false);
  isEmailSent$ = new BehaviorSubject<boolean>(false);

  form = this.fb.group({
    email: [
      null,
      [
        GovukValidators.required('Enter your email address'),
        GovukValidators.email('Enter an email address in the correct format, like name@example.com'),
        GovukValidators.maxLength(255, 'Enter an email address with a maximum of 255 characters'),
      ],
    ],
  });

  constructor(
    private readonly usersSecuritySetupService: UsersSecuritySetupService,
    private readonly fb: UntypedFormBuilder,
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      this.usersSecuritySetupService.requestToReset2fa({ email: this.form.get('email').value }).subscribe(() => {
        this.isEmailSent$.next(true);
      });
    } else {
      this.isSummaryDisplayed$.next(true);
    }
  }
}
