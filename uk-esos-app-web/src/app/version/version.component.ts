import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';

import { VERSION } from '../../environments/version';

@Component({
  selector: 'esos-version',
  standalone: true,
  template: `
    <esos-page-heading caption="Information about the application version" size="l">About</esos-page-heading>
    <p class="govuk-body">Version: <span class="govuk-!-font-weight-bold">RELEASE_VERSION</span></p>
    <p class="govuk-body">
      Commit hash: <span class="govuk-!-font-weight-bold">{{ version.hash }}</span>
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeadingComponent],
})
export class VersionComponent {
  version = VERSION;
}
