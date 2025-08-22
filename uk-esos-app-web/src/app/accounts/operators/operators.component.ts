import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, first, map, Observable, ReplaySubject, shareReplay, switchMap, takeUntil, tap } from 'rxjs';

import { accountFinalStatuses } from '@accounts/core/accountFinalStatuses';
import { DestroySubject } from '@core/services/destroy-subject.service';
import { AuthStore, selectUserId } from '@core/store/auth';
import { BusinessErrorService } from '@error/business-error/business-error.service';
import { catchBadRequest, ErrorCodes } from '@error/business-errors';
import { UserFullNamePipe } from '@shared/pipes/user-full-name.pipe';

import { GovukSelectOption, GovukTableColumn } from 'govuk-components';

import {
  AuthoritiesService,
  OperatorAuthoritiesService,
  OrganisationAccountDTO,
  UserAuthorityInfoDTO,
  UserInfoDTO,
} from 'esos-api';

import { savePartiallyNotFoundOperatorError } from './errors/business-error';
import {
  activeContactValidator,
  activeOperatorAdminValidator,
  contactTypeOptions,
  getContactTypeText,
  primaryContactValidator,
  restrictedUserContactValidator,
  uniqueContactType,
} from './operators.validations';

@Component({
  selector: 'esos-operators',
  templateUrl: './operators.component.html',
  styles: [
    `
      .fixed-width {
        width: 116px !important;
        overflow-wrap: break-word;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroySubject],
})
export class OperatorsComponent implements OnInit {
  isAccountEditable$: Observable<boolean>;
  accountAuthorities$: Observable<Array<UserAuthorityInfoDTO & { contactType: string }>>;
  isEditable$: Observable<boolean>;
  isSummaryDisplayed$ = new BehaviorSubject<boolean>(false);
  addUserForm: UntypedFormGroup = this.fb.group({ userType: ['operator'] });
  userType$: Observable<GovukSelectOption<string>[]>;
  userId$ = this.authStore.pipe(selectUserId, takeUntil(this.destroy$));
  refresh$ = new ReplaySubject<void>(1);

  editableCols: GovukTableColumn[] = [
    { field: 'name', header: 'Name', isSortable: true },
    { field: 'roleName', header: 'User type' },
    { field: 'contactType', header: 'Contact type' },
    { field: 'authorityStatus', header: 'Account status' },
    { field: 'deleteBtn', header: 'Remove Action', isHidden: true },
  ];

  nonEditableCols = this.editableCols.slice(0, 4);

  userTypes: GovukSelectOption<string>[] = [
    { text: 'Advanced user', value: 'operator_admin' },
    { text: 'Restricted user', value: 'operator' },
  ];

  authorityStatuses: GovukSelectOption<UserAuthorityInfoDTO['authorityStatus']>[] = [
    { text: 'Active', value: 'ACTIVE' },
    { text: 'Disabled', value: 'DISABLED' },
  ];

  authorityStatusesAccepted: GovukSelectOption<UserAuthorityInfoDTO['authorityStatus']>[] = [
    { text: 'Accepted', value: 'ACCEPTED' },
    { text: 'Active', value: 'ACTIVE' },
  ];

  contactTypeOptions = contactTypeOptions;

  usersForm = this.fb.group(
    {
      usersArray: this.fb.array([]),
    },
    {
      validators: [
        activeOperatorAdminValidator('You must have an advanced user on your account'),
        primaryContactValidator(),
        activeContactValidator('PRIMARY'),
        uniqueContactType('PRIMARY'),
        uniqueContactType('SECONDARY'),
        restrictedUserContactValidator('PRIMARY'),
        restrictedUserContactValidator('SECONDARY'),
      ],
    },
  );

  private accountId$ = this.route.paramMap.pipe(map((paramMap) => Number(paramMap.get('accountId'))));

  constructor(
    private readonly fb: UntypedFormBuilder,
    readonly authStore: AuthStore,
    private readonly authoritiesService: AuthoritiesService,
    private readonly operatorAuthoritiesService: OperatorAuthoritiesService,
    private readonly businessErrorService: BusinessErrorService,
    private readonly router: Router,
    private readonly destroy$: DestroySubject,
    private readonly route: ActivatedRoute,
  ) {}

  get usersArray(): UntypedFormArray {
    return this.usersForm.get('usersArray') as UntypedFormArray;
  }

  ngOnInit(): void {
    this.isAccountEditable$ = this.route.data.pipe(
      map((data?: { account?: OrganisationAccountDTO }) => {
        return accountFinalStatuses(data?.account?.status);
      }),
    );

    this.refresh$.next();
    const operatorsManagement$ = this.refresh$.pipe(
      switchMap(() => this.accountId$),
      switchMap((accountId) => this.operatorAuthoritiesService.getAccountOperatorAuthorities(accountId)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.accountAuthorities$ = operatorsManagement$.pipe(
      map((operators) =>
        operators.authorities.map((authority) => {
          const contactTypesEntries = Object.entries(operators.contactTypes).find(
            (entry) => entry[1] === authority.userId,
          );

          return { ...authority, contactType: contactTypesEntries ? contactTypesEntries[0] : null };
        }),
      ),
    );
    this.isEditable$ = operatorsManagement$.pipe(map((operators) => operators.editable));
    this.userType$ = this.accountId$.pipe(
      switchMap((accountId) => this.authoritiesService.getOperatorRoleCodes(accountId)),
      map((res) => res.map((role) => ({ text: role.name, value: role.code }))),
    );
  }

  addUser(userType: string): void {
    this.router.navigate(['users/add', userType], { relativeTo: this.route });
  }

  userFullName(user: UserInfoDTO): string {
    const userFullNamePipe = new UserFullNamePipe();

    return userFullNamePipe.transform(user);
  }

  getContactTypeText = getContactTypeText;

  saveUsers(): void {
    if (!this.usersForm.dirty) {
      return;
    }
    if (!this.usersForm.valid) {
      this.usersForm.markAllAsTouched();
      this.isSummaryDisplayed$.next(true);
    } else {
      const users = this.usersArray.value as Array<UserAuthorityInfoDTO & { contactType: string }>;

      this.accountId$
        .pipe(
          first(),
          switchMap((accountId) =>
            this.operatorAuthoritiesService.updateAccountOperatorAuthorities(accountId, {
              accountOperatorAuthorityUpdateList: this.usersArray.controls
                .filter((users) => users.dirty)
                .map((user) => ({
                  userId: user.value.userId,
                  roleCode: user.value.roleCode,
                  authorityStatus: user.value.authorityStatus,
                })),
              contactTypes: {
                PRIMARY: users.find((user) => user.contactType === 'PRIMARY')?.userId ?? null,
                SECONDARY: users.find((user) => user.contactType === 'SECONDARY')?.userId ?? null,
              },
            }),
          ),
          tap(() => this.usersForm.markAsPristine()),
          catchBadRequest(ErrorCodes.AUTHORITY1004, () =>
            this.accountId$.pipe(
              switchMap((accountId) =>
                this.businessErrorService.showError(savePartiallyNotFoundOperatorError(accountId)),
              ),
            ),
          ),
        )
        .subscribe(() => this.refresh$.next());
    }
  }
}
