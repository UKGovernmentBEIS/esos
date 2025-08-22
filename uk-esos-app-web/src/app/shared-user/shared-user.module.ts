import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';
import { PasswordStrengthMeterComponent } from 'angular-password-strength-meter';

import { PasswordComponent } from './password/password.component';
import { PasswordService } from './password/password.service';
import { SubmitIfEmptyPipe } from './pipes/submit-if-empty.pipe';

@NgModule({
  declarations: [PasswordComponent, SubmitIfEmptyPipe],
  imports: [PasswordStrengthMeterComponent, RouterModule, SharedModule],
  providers: [PasswordService],
  exports: [PasswordComponent, SubmitIfEmptyPipe],
})
export class SharedUserModule {}
