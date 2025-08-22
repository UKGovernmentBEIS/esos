import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  filter,
  first,
  map,
  Observable,
  shareReplay,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs';

import { DestroySubject } from '@core/services/destroy-subject.service';
import { AuthStore, selectUserId } from '@core/store/auth';
import { BusinessErrorService } from '@error/business-error/business-error.service';
import { catchBadRequest, ErrorCodes } from '@error/business-errors';

import { GovukTableColumn, GovukValidators } from 'govuk-components';

import {
  AuthoritiesService,
  AuthorityManagePermissionDTO,
  RegulatorAuthoritiesService,
  RegulatorUserDTO,
  RegulatorUsersService,
} from 'esos-api';

import { saveNotFoundRegulatorError } from '../errors/business-error';

@Component({
  selector: 'esos-details',
  templateUrl: './details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroySubject],
})
export class DetailsComponent implements OnInit {
  basePermissionSelected: string;
  userFullName: string;

  isSummaryDisplayed$ = new BehaviorSubject<boolean>(false);
  confirmedAddedRegulator$ = new BehaviorSubject<string>(null);
  allowEditPermissions$: Observable<boolean>;
  userPermissions$: Observable<AuthorityManagePermissionDTO['permissions']>;

  userId$ = this.activatedRoute.paramMap.pipe(map((parameters) => parameters.get('userId')));
  isLoggedUser$ = combineLatest([this.authStore.pipe(selectUserId), this.userId$]).pipe(
    first(),
    map(([loggedInUserId, userId]) => loggedInUserId === userId),
  );
  isInviteUserMode = !this.activatedRoute.snapshot.paramMap.has('userId');

  userRolePermissions$ = this.authoritiesService
    .getRegulatorRoles()
    .pipe(takeUntil(this.destroy$), shareReplay({ bufferSize: 1, refCount: false }));

  permissionGroups$ = this.regulatorAuthoritiesService
    .getRegulatorPermissionGroupLevels()
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  form = this.fb.group({
    user: this.fb.group({
      firstName: [
        null,
        [
          GovukValidators.required(`Enter user's first name`),
          GovukValidators.maxLength(255, 'First name should not be more than 255 characters'),
        ],
      ],
      lastName: [
        null,
        [
          GovukValidators.required(`Enter user's last name`),
          GovukValidators.maxLength(255, 'Last name should not be more than 255 characters'),
        ],
      ],
      phoneNumber: [
        null,
        [
          GovukValidators.empty(`Enter user's phone number`),
          GovukValidators.maxLength(255, 'Phone number should not be more than 255 characters'),
        ],
      ],
      mobileNumber: [null, GovukValidators.maxLength(255, 'Mobile number should not be more than 255 characters')],
      email: [
        null,
        [
          GovukValidators.required(`Enter user's email`),
          GovukValidators.maxLength(255, 'Email should not be more than 255 characters'),
          GovukValidators.email('Enter an email address in the correct format, like name@example.com'),
        ],
      ],
      jobTitle: [
        null,
        [
          GovukValidators.required(`Enter user's job title`),
          GovukValidators.maxLength(255, 'Job title should not be more than 255 characters'),
        ],
      ],
    }),

    permissions: this.fb.group({
      ASSIGN_REASSIGN_TASKS: ['NONE'],
      MANAGE_USERS_AND_CONTACTS: ['NONE'],
      REVIEW_ORGANISATION_ACCOUNT: ['NONE'],
      MANAGE_VERIFIED_ORGANISATION_ACCOUNTS: ['NONE'],
      MANAGE_PARTICIPANT_USERS: ['NONE'],
      RETURN_NOC: ['NONE'],
      RETURN_ACTION_PLAN: ['NONE'],
      RETURN_PROGRESS_UPDATE_1: ['NONE'],
      RETURN_PROGRESS_UPDATE_2: ['NONE'],
      ACCOUNT_CLOSURE: ['NONE'],
    }),
  });

  tableColumns: GovukTableColumn[] = [
    { field: 'task', header: 'Task / Item name', isSortable: false },
    { field: 'type', header: 'Type', isSortable: false },
    { field: 'EXECUTE', header: 'Execute', isSortable: false },
    { field: 'VIEW_ONLY', header: 'View only', isSortable: false },
    { field: 'NONE', header: 'None', isSortable: false },
  ];

  tableRows = [
    {
      permission: 'ASSIGN_REASSIGN_TASKS',
      task: 'Assign/re-assign tasks',
      type: 'Task assignment',
    },
    {
      permission: 'MANAGE_USERS_AND_CONTACTS',
      task: 'Manage users and contacts',
      type: 'Regulator users',
    },
    {
      permission: 'REVIEW_ORGANISATION_ACCOUNT',
      task: 'Review organisation account',
      type: 'Organisation account details',
    },
    {
      permission: 'RETURN_NOC',
      task: 'Return NOC',
      type: 'Notification of Compliance',
    },
    {
      permission: 'RETURN_ACTION_PLAN',
      task: 'Return Action Plan',
      type: 'Action Plan',
    },
    {
      permission: 'RETURN_PROGRESS_UPDATE_1',
      task: 'Return Progress Update 1',
      type: 'Progress Update 1',
    },
    {
      permission: 'RETURN_PROGRESS_UPDATE_2',
      task: 'Return Progress Update 2',
      type: 'Progress Update 2',
    },
    {
      permission: 'MANAGE_VERIFIED_ORGANISATION_ACCOUNTS',
      task: 'Upload verified list',
      type: 'Organisation account application',
    },
    {
      permission: 'MANAGE_PARTICIPANT_USERS',
      task: 'Manage participant users',
      type: 'Users and contacts',
    },
    {
      permission: 'ACCOUNT_CLOSURE',
      task: 'Close account',
      type: 'Account closure',
    },
  ];

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly authStore: AuthStore,
    private readonly authoritiesService: AuthoritiesService,
    private readonly router: Router,
    private readonly regulatorAuthoritiesService: RegulatorAuthoritiesService,
    private readonly regulatorUsersService: RegulatorUsersService,
    private readonly destroy$: DestroySubject,
    private readonly businessErrorService: BusinessErrorService,
  ) {}

  ngOnInit(): void {
    const routeData = this.activatedRoute.data as Observable<{
      user: RegulatorUserDTO;
      permissions: AuthorityManagePermissionDTO;
    }>;
    this.allowEditPermissions$ = routeData.pipe(map(({ permissions }) => !permissions || permissions.editable));
    this.userPermissions$ = routeData.pipe(map(({ permissions }) => permissions?.permissions));
    routeData
      .pipe(
        takeUntil(this.destroy$),
        filter(({ user, permissions }) => !!user && !!permissions),
      )
      .subscribe(({ user, permissions: { permissions } }) => {
        this.form.patchValue({
          user,
          permissions,
        });
        this.form.get('user').get('email').disable();
        this.userFullName = user.firstName + ' ' + user.lastName;
      });
  }

  setBasePermissions(roleCode: string): void {
    this.basePermissionSelected = roleCode;
    this.userRolePermissions$.subscribe((roles) => {
      const { rolePermissions } = roles.find((role) => role.code === roleCode);
      this.form.get('permissions').patchValue(rolePermissions);
    });

    this.form.markAsDirty();
  }

  submitForm(): void {
    if (this.form.valid) {
      const userEmail = this.form.get('user').get('email').value;
      const userId$ = this.userId$.pipe(first());
      userId$
        .pipe(
          withLatestFrom(this.authStore.pipe(selectUserId)),
          switchMap(([userId, loggedInUserId]) => {
            if (userId) {
              const payload = { ...this.form.getRawValue() };
              return userId === loggedInUserId
                ? this.regulatorUsersService.updateCurrentRegulatorUser(payload, null)
                : this.regulatorUsersService.updateRegulatorUserByCaAndId(userId, payload, null);
            } else {
              const payload = { ...this.form.get('user').value, permissions: this.form.get('permissions').value };
              return this.regulatorUsersService.inviteRegulatorUserToCA(payload, null);
            }
          }),
          catchBadRequest([ErrorCodes.USER1001, ErrorCodes.AUTHORITY1005], () => {
            this.form.get('user').get('email').setErrors({
              emailExists: 'This user email already exists in the service',
            });
            this.isSummaryDisplayed$.next(true);

            return EMPTY;
          }),
          catchBadRequest(ErrorCodes.AUTHORITY1003, () =>
            this.businessErrorService.showError(saveNotFoundRegulatorError),
          ),
          switchMap(() => userId$),
        )
        .subscribe((userId) => {
          if (userId) {
            this.router.navigate(['../../regulators'], { relativeTo: this.activatedRoute });
          } else {
            this.confirmedAddedRegulator$.next(userEmail);
          }
        });
    } else {
      this.isSummaryDisplayed$.next(true);
    }
  }

  getCurrentUserDownloadUrl(uuid: string): string | string[] {
    return ['..', 'file-download', uuid];
  }

  getDownloadUrl(uuid: string): string | string[] {
    return ['file-download', uuid];
  }
}
