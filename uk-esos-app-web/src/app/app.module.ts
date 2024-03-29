import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApplicationRef, DoBootstrap, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { combineLatest, firstValueFrom } from 'rxjs';

import { initializeGoogleAnalytics } from '@core/analytics';
import { FeaturesConfigService } from '@core/features/features-config.service';
import { AnalyticsInterceptor } from '@core/interceptors/analytics.interceptor';
import { HttpErrorInterceptor } from '@core/interceptors/http-error.interceptor';
import { PendingRequestInterceptor } from '@core/interceptors/pending-request.interceptor';
import { AuthService } from '@core/services/auth.service';
import { GlobalErrorHandlingService } from '@core/services/global-error-handling.service';
import { markdownModuleConfig } from '@shared/markdown/markdown-options';
import { SharedModule } from '@shared/shared.module';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { DEFAULT_PSM_OPTIONS } from 'angular-password-strength-meter/zxcvbn';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { MarkdownModule } from 'ngx-markdown';

import { ApiModule, Configuration } from 'esos-api';

import { environment } from '../environments/environment';
import { AccessibilityComponent } from './accessibility/accessibility.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CookiesContainerComponent } from './cookies/cookies-container.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LegislationComponent } from './legislation/legislation.component';
import { PrivacyNoticeComponent } from './privacy-notice/privacy-notice.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { TimeoutModule } from './timeout/timeout.module';
import { VersionComponent } from './version/version.component';

const keycloakService = new KeycloakService();

@NgModule({
  declarations: [AppComponent, CookiesContainerComponent],
  imports: [
    AccessibilityComponent,
    ApiModule.forRoot(() => new Configuration({ basePath: environment.apiOptions.baseUrl })),
    AppRoutingModule,
    BrowserModule,
    ContactUsComponent,
    FeedbackComponent,
    KeycloakAngularModule,
    LandingPageComponent,
    LegislationComponent,
    MarkdownModule.forRoot(markdownModuleConfig),
    PasswordStrengthMeterModule.forRoot(DEFAULT_PSM_OPTIONS),
    PrivacyNoticeComponent,
    SharedModule,
    TermsAndConditionsComponent,
    TimeoutModule,
    VersionComponent,
  ],
  providers: [
    {
      provide: KeycloakService,
      useValue: keycloakService,
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlingService,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PendingRequestInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AnalyticsInterceptor,
      multi: true,
    },
    Title,
  ],
})
export class AppModule implements DoBootstrap {
  ngDoBootstrap(appRef: ApplicationRef): void {
    const authService = appRef.injector.get(AuthService);
    const featuresService = appRef.injector.get(FeaturesConfigService);
    firstValueFrom(featuresService.initFeatureState())
      .then(() => keycloakService.init(environment.keycloakOptions))
      .then(() => firstValueFrom(authService.checkUser()))
      .then(() => firstValueFrom(combineLatest([featuresService.getMeasurementId(), featuresService.getPropertyId()])))
      .then(([measurementId, propertyId]) => initializeGoogleAnalytics(measurementId, propertyId))
      .then(() => appRef.bootstrap(AppComponent))
      .catch((error) => console.error('[ngDoBootstrap] init Keycloak failed', error));
  }
}
