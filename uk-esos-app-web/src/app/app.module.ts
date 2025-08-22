import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApplicationRef, DoBootstrap, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TitleStrategy } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { FeaturesConfigService } from '@core/features/features-config.service';
import { HttpErrorInterceptor } from '@core/interceptors/http-error.interceptor';
import { PendingRequestInterceptor } from '@core/interceptors/pending-request.interceptor';
import { EsosTitleStrategy } from '@core/navigation/esos-title-strategy';
import { AuthService } from '@core/services/auth.service';
import { GlobalErrorHandlingService } from '@core/services/global-error-handling.service';
import { SharedModule } from '@shared/shared.module';
import { provideZxvbnServiceForPSM } from 'angular-password-strength-meter/zxcvbn';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

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
    PrivacyNoticeComponent,
    SharedModule,
    TermsAndConditionsComponent,
    TimeoutModule,
    VersionComponent,
  ],
  providers: [
    provideZxvbnServiceForPSM(),
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
    { provide: TitleStrategy, useClass: EsosTitleStrategy },
  ],
})
export class AppModule implements DoBootstrap {
  ngDoBootstrap(appRef: ApplicationRef): void {
    const authService = appRef.injector.get(AuthService);
    const featuresService = appRef.injector.get(FeaturesConfigService);

    firstValueFrom(featuresService.initFeatureState())
      .then(async () => {
        try {
          return await keycloakService.init(environment.keycloakOptions);
        } catch (error) {
          console.warn('Keycloak first init failed - retrying after replacement with clean url', error);
          return await keycloakService.init(environment.keycloakOptions);
        }
      })
      .then(() => firstValueFrom(authService.checkUser()))
      .then(() => appRef.bootstrap(AppComponent))
      .catch((error) => console.error('[ngDoBootstrap] init Keycloak failed', error));
  }
}
