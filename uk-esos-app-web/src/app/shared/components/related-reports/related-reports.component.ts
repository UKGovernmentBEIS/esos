import { ChangeDetectionStrategy, Component, Input, OnDestroy, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { RouterLink } from '@angular/router';

import { filter, Subscription } from 'rxjs';

import { RelatedContentComponent } from '@shared/components/related-content/related-content.component';
import { RequestActionReportService } from '@shared/services/request-action-report.service';

import { LinkDirective } from 'govuk-components';

import { PrintComponent } from '../print/print.component';

@Component({
  selector: 'esos-related-reports',
  standalone: true,
  template: `
    <esos-related-content header="Related actions">
      <ul class="govuk-list govuk-!-font-size-16">
        <li>
          <a govukLink (click)="printRequestAction()" routerLink=".">Download PDF of submitted NOC</a>
        </li>
      </ul>
      <esos-print #printComp>
        <ng-template #printContainerRef></ng-template>
      </esos-print>
    </esos-related-content>
  `,
  imports: [PrintComponent, LinkDirective, RouterLink, RelatedContentComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelatedReportsComponent implements OnDestroy {
  @Input() dataComponent: Type<unknown>;

  @ViewChild('printContainerRef', { read: ViewContainerRef })
  printContainerRef: ViewContainerRef;

  @ViewChild('printComp') printComponent: PrintComponent;

  private printSubscription: Subscription;

  constructor(private requestActionReportService: RequestActionReportService) {
    this.printSubscription = this.requestActionReportService.printReport$
      .pipe(filter((print) => !!print))
      .subscribe((filename) => this.printComponent.print(filename));
  }

  ngOnDestroy(): void {
    this.requestActionReportService.clear();
    this.printSubscription.unsubscribe();
  }

  printRequestAction() {
    this.printContainerRef.clear();
    this.printContainerRef.createComponent(this.dataComponent);
  }
}
