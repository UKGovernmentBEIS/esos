import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmailLinkInvalidComponent } from './email-link-invalid/email-link-invalid.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SubmitEmailComponent } from './submit-email/submit-email.component';
import { SubmitOtpComponent } from './submit-otp/submit-otp.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Forgot password',
    data: { breadcrumb: true },
    component: SubmitEmailComponent,
  },
  {
    path: 'invalid-link',
    title: 'This link is invalid',
    data: { breadcrumb: true },
    component: EmailLinkInvalidComponent,
  },
  {
    path: 'reset-password',
    title: 'Reset password',
    data: { breadcrumb: true },
    component: ResetPasswordComponent,
  },
  {
    path: 'otp',
    title: 'Submit otp',
    data: { breadcrumb: true },
    component: SubmitOtpComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgotPasswordRoutingModule {}
