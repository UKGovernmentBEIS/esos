import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { filter, map } from 'rxjs';

/* eslint-disable @angular-eslint/prefer-on-push-component-change-detection */
@Component({
  selector: 'govuk-skip-link',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  template: `
    <a class="govuk-skip-link" [routerLink]="routerLink | async" [fragment]="anchor"> Skip to main content </a>
  `,
})
export class SkipLinkComponent {
  @Input() anchor = 'main-content';

  routerLink = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map((event: NavigationEnd) => event.url.split('#')[0].split('?')[0]),
  );

  constructor(private readonly router: Router) {}
}
