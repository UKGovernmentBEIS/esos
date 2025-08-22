import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AuthService } from '@core/services/auth.service';
import { BackToTopComponent } from '@shared/back-to-top/back-to-top.component';
import { RelatedContentComponent } from '@shared/components/related-content/related-content.component';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';

import { GovukComponentsModule } from 'govuk-components';

@Component({
  selector: 'esos-start-login',
  standalone: true,
  template: `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <govuk-notification-banner heading="Important">
          <p class="govuk-notification-banner__heading">How your sign in has changed</p>
          <p>Sign in using your GOV.UK One Login. If you don't have one you can create one.</p>
          <p>If you have sign in for ESOS, you should use the same email address to create your GOV.UK One Login.</p>
        </govuk-notification-banner>
        <esos-page-heading>Create a GOV.UK One Login or sign in</esos-page-heading>
        <div class="govuk-body">
          <p>
            You need a GOV.UK One Login to sign in to this service. You can create one if you do not already have one.
          </p>

          <button type="button" class="govuk-button" (click)="continue()">Continue</button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    AsyncPipe,
    PageHeadingComponent,
    RouterLink,
    RelatedContentComponent,
    BackToTopComponent,
    GovukComponentsModule,
  ],
})
export class StartLoginComponent implements OnInit {
  private redirectUrl: string = '';
  private email: string = '';

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.redirectUrl = params['redirectUrl'];
      this.email = params['email'];
    });
  }

  continue(): void {
    this.authService.login({ redirectUri: this.redirectUrl, loginHint: this.email });
  }
}
