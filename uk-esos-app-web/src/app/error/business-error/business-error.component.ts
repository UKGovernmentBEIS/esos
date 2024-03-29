import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';

import { BusinessErrorService } from './business-error.service';

@Component({
  selector: 'esos-business-error',
  template: `
    <esos-error-page *ngIf="businessErrorService.error$ | async as error" [heading]="error.heading">
      <p class="govuk-body">
        <a govukLink [routerLink]="error.link" [fragment]="error.fragment">{{ error.linkText }}</a>
      </p>
    </esos-error-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessErrorComponent implements OnDestroy {
  constructor(readonly businessErrorService: BusinessErrorService) {}

  ngOnDestroy(): void {
    this.businessErrorService.clear();
  }
}
