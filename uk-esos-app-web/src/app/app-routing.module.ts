import { NgModule } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  BaseRouteReuseStrategy,
  ExtraOptions,
  RouteReuseStrategy,
  RouterModule,
  Routes,
} from '@angular/router';

import { InstallationAuthGuard } from '@core/guards/installation-auth.guard';
import { LoggedInGuard } from '@core/guards/logged-in.guard';
import { NonAuthGuard } from '@core/guards/non-auth.guard';
import { PendingRequestGuard } from '@core/guards/pending-request.guard';
import { RegisteredUserGuard } from '@core/guards/registered-user.guard';

import { AccessibilityComponent } from './accessibility/accessibility.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LandingPageGuard } from './landing-page/landing-page.guard';
import { PrivacyNoticeComponent } from './privacy-notice/privacy-notice.component';
import { StartLoginComponent } from './start-login/start-login.component';
import { TimedOutComponent } from './timeout/timed-out/timed-out.component';
import { VersionComponent } from './version/version.component';

const routes: Routes = [
  {
    path: 'landing',
    title: 'Home',
    data: { breadcrumb: 'Home' },
    component: LandingPageComponent,
    canActivate: [LandingPageGuard],
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: 'start-login',
    title: 'Start login',
    component: StartLoginComponent,
    canDeactivate: [PendingRequestGuard],
    canActivate: [NonAuthGuard],
  },
  {
    path: '',
    data: { breadcrumb: 'Home' },
    children: [
      {
        path: 'about',
        title: 'About',
        data: { breadcrumb: true },
        component: VersionComponent,
      },
      {
        path: 'privacy-notice',
        title: 'Privacy notice',
        data: { breadcrumb: true },
        component: PrivacyNoticeComponent,
      },
      {
        path: 'accessibility',
        title: 'Accessibility Statement',
        data: { breadcrumb: true },
        component: AccessibilityComponent,
      },
      {
        path: 'contact-us',
        title: 'Contact us',
        data: { breadcrumb: true },
        component: ContactUsComponent,
      },
      {
        path: 'feedback',
        title: 'Feedback',
        data: { breadcrumb: true },
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
    title: 'Session Timeout',
    canActivate: [NonAuthGuard],
    component: TimedOutComponent,
  },
  {
    path: '',
    canActivate: [LoggedInGuard, RegisteredUserGuard],
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
  anchorScrolling: 'enabled',
  paramsInheritanceStrategy: 'always',
};

class AppRouteReuseStrategy extends BaseRouteReuseStrategy {
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.data.preventReuseRoute ? false : future.routeConfig === curr.routeConfig;
  }
}

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
  providers: [LandingPageGuard, { provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy }],
})
export class AppRoutingModule {}
