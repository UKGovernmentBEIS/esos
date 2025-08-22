import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AnalyticsService } from '@core/services/analytics.service';

import { CookiesService } from './cookies.service';

@Component({
  selector: 'esos-cookies-container',
  template: `
    <govuk-cookies-pop-up
      cookiesExpirationTime="1"
      [areBrowserCookiesEnabled]="cookiesEnabled"
      [cookiesAccepted]="cookiesAccepted$ | async"
      (cookiesAcceptedEmitter)="acceptCookies($event)"
    >
    </govuk-cookies-pop-up>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookiesContainerComponent {
  constructor(
    private readonly cookiesService: CookiesService,
    private readonly analyticsService: AnalyticsService,
  ) {}
  cookiesEnabled = this.cookiesService.cookiesEnabled();
  cookiesAccepted$ = this.cookiesService.accepted$;

  acceptCookies(expired: string) {
    this.cookiesService.acceptAllCookies(+expired);
    this.analyticsService.enableGoogleTagManager();
  }
}
