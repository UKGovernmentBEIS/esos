import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { BehaviorSubject, takeUntil } from 'rxjs';

import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';

import { GovukComponentsModule, GovukValidators } from 'govuk-components';

import { UserFeedbackDto, UsersService } from 'esos-api';

import { DestroySubject } from '../core/services/destroy-subject.service';

type Rate = UserFeedbackDto['creatingAccountRate'];
type RateWithoutNotApplicable = Exclude<Rate, 'NOT_APPLICABLE_NOT_USED_YET'>;

@Component({
  selector: 'esos-feedback',
  standalone: true,
  templateUrl: './feedback.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroySubject],
  imports: [
    PageHeadingComponent,
    GovukComponentsModule,
    AsyncPipe,
    ReactiveFormsModule,
    NgForOf,
    PendingButtonDirective,
    NgIf,
  ],
})
export class FeedbackComponent implements OnInit {
  feedbackSent$ = new BehaviorSubject<boolean>(null);
  isErrorSummaryDisplayed = new BehaviorSubject<boolean>(false);

  feedbackForm: UntypedFormGroup = this.fb.group({
    userRegistrationRate: [
      null,
      { validators: GovukValidators.required('Select a rating for user registration'), updateOn: 'change' },
    ],
    userRegistrationRateReason: [{ value: null, disabled: true }],

    onlineGuidanceRate: [
      null,
      {
        validators: GovukValidators.required('Select a rating for online guidance and communication'),
        updateOn: 'change',
      },
    ],
    onlineGuidanceRateReason: [{ value: null, disabled: true }],

    creatingAccountRate: [
      null,
      {
        validators: GovukValidators.required('Select a rating for claiming an account'),
        updateOn: 'change',
      },
    ],
    creatingAccountRateReason: [{ value: null, disabled: true }],

    onBoardingRate: [
      null,
      {
        validators: GovukValidators.required('Select a rating for on-boarding, identity and security checks'),
        updateOn: 'change',
      },
    ],
    onBoardingRateReason: [{ value: null, disabled: true }],

    tasksRate: [
      null,
      {
        validators: GovukValidators.required('Select a rating for viewing, searching and responding to tasks'),
        updateOn: 'change',
      },
    ],
    tasksRateReason: [{ value: null, disabled: true }],

    satisfactionRate: [
      null,
      {
        validators: GovukValidators.required('Select a rating for overall experience with this service so far'),
        updateOn: 'change',
      },
    ],
    satisfactionRateReason: [{ value: null, disabled: true }],

    improvementSuggestion: [null],
  });

  rateOptions: Rate[] = [
    'VERY_SATISFIED',
    'SATISFIED',
    'NEITHER_SATISFIED_NOR_DISSATISFIED',
    'DISSATISFIED',
    'VERY_DISSATISFIED',
    'NOT_APPLICABLE_NOT_USED_YET',
  ];

  rateOptionsWithoutNotApplicable: RateWithoutNotApplicable[] = [
    'VERY_SATISFIED',
    'SATISFIED',
    'NEITHER_SATISFIED_NOR_DISSATISFIED',
    'DISSATISFIED',
    'VERY_DISSATISFIED',
  ];

  private rateOptionsLabels: Record<Rate, string> = {
    VERY_SATISFIED: 'Very satisfied',
    SATISFIED: 'Satisfied',
    NEITHER_SATISFIED_NOR_DISSATISFIED: 'Neither satisfied or dissatisfied',
    DISSATISFIED: 'Dissatisfied',
    VERY_DISSATISFIED: 'Very dissatisfied',
    NOT_APPLICABLE_NOT_USED_YET: 'Not applicable or not used yet',
  };

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly usersService: UsersService,
    private readonly destroy$: DestroySubject,
  ) {}

  ngOnInit(): void {
    this.feedbackForm
      .get('userRegistrationRate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.feedbackForm.get('userRegistrationRateReason').enable());

    this.feedbackForm
      .get('onlineGuidanceRate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.feedbackForm.get('onlineGuidanceRateReason').enable());

    this.feedbackForm
      .get('creatingAccountRate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.feedbackForm.get('creatingAccountRateReason').enable());

    this.feedbackForm
      .get('onBoardingRate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.feedbackForm.get('onBoardingRateReason').enable());

    this.feedbackForm
      .get('tasksRate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.feedbackForm.get('tasksRateReason').enable());

    this.feedbackForm
      .get('satisfactionRate')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.feedbackForm.get('satisfactionRateReason').enable());
  }

  onSubmit() {
    if (this.feedbackForm.valid) {
      this.usersService.provideUserFeedback(this.feedbackForm.value).subscribe(() => this.feedbackSent$.next(true));
    } else {
      this.isErrorSummaryDisplayed.next(true);
    }
  }

  rateOptionLabel(option: Rate): string {
    return this.rateOptionsLabels[option];
  }
}
