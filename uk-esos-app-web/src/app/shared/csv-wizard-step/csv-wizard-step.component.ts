import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { BehaviorSubject, filter, startWith, take } from 'rxjs';

import { ReturnToTaskOrActionPageComponent } from '@common/shared/components/return-to-link';
import { CsvErrorSummaryComponent } from '@shared/csv-error-summary/csv-error-summary.component';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';

import { ButtonDirective, LinkDirective } from 'govuk-components';

@Component({
  selector: 'esos-csv-wizard-step',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    AsyncPipe,
    PageHeadingComponent,
    ButtonDirective,
    PendingButtonDirective,
    ReactiveFormsModule,
    LinkDirective,
    CsvErrorSummaryComponent,
    ReturnToTaskOrActionPageComponent,
  ],
  templateUrl: './csv-wizard-step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CsvWizardStepComponent {
  @Input() showBackLink = false;
  @Input() formGroup: UntypedFormGroup;
  @Input() heading: string;
  @Input() caption: string;
  @Input() submitText = 'Continue';
  @Input() hideSubmit: boolean;
  @Input() showReturnLink = false;
  @Input() showCancelLink: boolean = false;
  @Input() cancelLinkPath: string;
  @Output() readonly formSubmit = new EventEmitter<UntypedFormGroup>();

  isSummaryDisplayedSubject = new BehaviorSubject(false);

  onSubmit(): void {
    this.formGroup.statusChanges
      .pipe(
        startWith(this.formGroup.status),
        filter((status) => status !== 'PENDING'),
        take(1),
      )
      .subscribe((status) => {
        switch (status) {
          case 'VALID':
            this.formSubmit.emit(this.formGroup);
            break;
          case 'INVALID':
            this.formGroup.markAllAsTouched();
            this.isSummaryDisplayedSubject.next(true);
            break;
        }
      });
  }
}
