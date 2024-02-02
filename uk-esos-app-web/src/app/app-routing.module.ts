import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

import { InstallationAuthGuard } from '@core/guards/installation-auth.guard';
import { LoggedInGuard } from '@core/guards/logged-in.guard';
import { NonAuthGuard } from '@core/guards/non-auth.guard';
import { PendingRequestGuard } from '@core/guards/pending-request.guard';

import { AccessibilityComponent } from './accessibility/accessibility.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LandingPageGuard } from './landing-page/landing-page.guard';
import { LegislationComponent } from './legislation/legislation.component';
import { PrivacyNoticeComponent } from './privacy-notice/privacy-notice.component';
import { TimedOutComponent } from './timeout/timed-out/timed-out.component';
import { VersionComponent } from './version/version.component';

const routes: Routes = [
  {
    path: 'landing',
    data: { pageTitle: 'Manage your ESOS reporting', breadcrumb: 'Home' },
    component: LandingPageComponent,
    canActivate: [LandingPageGuard],
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: '',
    data: { breadcrumb: 'Home' },
    children: [
      {
        path: 'about',
        data: { pageTitle: 'About', breadcrumb: true },
        component: VersionComponent,
      },
      {
        path: 'privacy-notice',
        data: { pageTitle: 'Privacy notice', breadcrumb: true },
        component: PrivacyNoticeComponent,
      },
      {
        path: 'accessibility',
        data: { pageTitle: 'Accessibility Statement', breadcrumb: true },
        component: AccessibilityComponent,
      },
      {
        path: 'contact-us',
        data: { pageTitle: 'Contact us', breadcrumb: true },
        component: ContactUsComponent,
      },
      {
        path: 'legislation',
        data: { pageTitle: 'UK ETS legislation', breadcrumb: true },
        component: LegislationComponent,
      },
      {
        path: 'feedback',
        data: { pageTitle: 'Feedback', breadcrumb: true },
        component: FeedbackComponent,
        canDeactivate: [PendingRequestGuard],
      },
      {
        path: 'forgot-password',
        loadChildren: () => import('./forgot-password/forgot-password.module').then((m) => m.ForgotPasswordModule),
      },
      {
        path: '2fa',
        loadChildren: () => import('./two-fa/two-fa.module').then((m) => m.TwoFaModule),
      },
      {
        path: 'registration',
        loadChildren: () => import('./registration/registration.module').then((m) => m.RegistrationModule),
      },
    ],
  },
  {
    path: 'error',
    loadChildren: () => import('./error/error.module').then((m) => m.ErrorModule),
  },
  {
    path: 'invitation',
    loadChildren: () => import('./invitation/invitation.module').then((m) => m.InvitationModule),
  },

  {
    path: 'timed-out',
    data: { pageTitle: 'Session Timeout' },
    canActivate: [NonAuthGuard],
    component: TimedOutComponent,
  },
  {
    path: '',
    canActivate: [LoggedInGuard],
    children: [
      {
        path: '',
        data: { breadcrumb: 'Dashboard' },
        children: [
          {
            path: 'dashboard',
            data: { breadcrumb: 'Dashboard' },
            canActivate: [InstallationAuthGuard],
            loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
          },
          {
            path: 'accounts',
            data: { breadcrumb: 'Accounts' },
            //TODO check how to refactor the guard accordingly
            // canActivate: [InstallationAuthGuard],
            loadChildren: () => import('./accounts/accounts.module').then((m) => m.AccountsModule),
          },
          {
            path: 'user',
            canActivate: [InstallationAuthGuard],
            children: [
              {
                path: 'regulators',
                data: { breadcrumb: 'Regulator users' },
                loadChildren: () => import('./regulators/regulators.module').then((m) => m.RegulatorsModule),
              },
            ],
          },
          {
            path: 'tasks',
            canActivate: [InstallationAuthGuard],
            loadChildren: () => import('./tasks/tasks.routes').then((r) => r.TASKS_ROUTES),
          },
          {
            path: 'payment',
            canActivate: [InstallationAuthGuard],
            loadChildren: () => import('./payment/payment.module').then((m) => m.PaymentModule),
          },
          // {
          //   path: 'terms',
          //   data: { pageTitle: 'Accept terms and conditions' },
          //   component: TermsAndConditionsComponent,
          //   canActivate: [TermsAndConditionsGuard],
          //   canDeactivate: [PendingRequestGuard],
          // },
          {
            path: 'templates',
            data: { breadcrumb: 'Templates' },
            canActivate: [InstallationAuthGuard],
            loadChildren: () => import('./templates/templates.module').then((m) => m.TemplatesModule),
          },
          {
            path: 'mi-reports',
            data: { breadcrumb: 'MI Reports' },
            canActivate: [InstallationAuthGuard],
            loadChildren: () => import('./mi-reports/mi-reports.module').then((m) => m.MiReportsModule),
          },
        ],
      },
    ],
  },
  // The route below handles all unknown routes / Page Not Found functionality.
  // Please keep this route last else there will be unexpected behavior.
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

const routerOptions: ExtraOptions = {
  paramsInheritanceStrategy: 'always',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
  providers: [LandingPageGuard],
})
export class AppRoutingModule {}
