import { ChangeDetectorRef, Directive, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { BehaviorSubject, combineLatest, map, Observable, shareReplay, takeUntil, tap } from 'rxjs';

import { DestroySubject } from '@core/services/destroy-subject.service';
import { UserFullNamePipe } from '@shared/pipes/user-full-name.pipe';

import { SortEvent, TableComponent } from 'govuk-components';

import { UsersTableItem } from './users-table-item';

@Directive({
  selector: 'govuk-table[esosUsersTable]',
  providers: [UserFullNamePipe, DestroySubject],
})
export class UsersTableDirective implements OnInit {
  @Input() users: Observable<UsersTableItem[]>;
  @Input() form: UntypedFormGroup;

  private sorting$ = new BehaviorSubject<SortEvent>({ column: 'createdDate', direction: 'descending' });

  constructor(
    private readonly host: TableComponent<UsersTableItem>,
    private readonly fb: UntypedFormBuilder,
    private readonly destroy$: DestroySubject,
    private readonly userFullNamePipe: UserFullNamePipe,
    private readonly cdRef: ChangeDetectorRef,
  ) {}

  private get formArray(): UntypedFormArray {
    return this.form.get(this.formArrayName) as UntypedFormArray;
  }

  private get formArrayName(): string {
    return Object.keys(this.form.controls).find((key) => this.form.get(key) instanceof UntypedFormArray);
  }

  ngOnInit(): void {
    combineLatest([
      this.users.pipe(
        map((users) =>
          users.slice().map((userAuthority) =>
            this.fb.group(
              {
                userId: [userAuthority.userId],
                firstName: [userAuthority.firstName],
                lastName: [userAuthority.lastName],
                authorityStatus: [userAuthority.authorityStatus],
                locked: [userAuthority.locked],
                roleCode: [userAuthority.roleCode],
                roleName: [userAuthority.roleName],
                jobTitle: [userAuthority.jobTitle],
                authorityCreationDate: [userAuthority.authorityCreationDate],
                contactType: [userAuthority.contactType],
              },
              { updateOn: 'change' }, // Update on change so that the change is reflected in resorting
            ),
          ),
        ),
      ),
      this.sorting$.pipe(map((sorting) => this.createSorterByColumn(sorting))),
    ])
      .pipe(
        takeUntil(this.destroy$),
        tap(([items, sorter]) => this.setFormArray(items.sort(sorter))),
        map(() => this.formArray.value),
        tap(() => this.cdRef.markForCheck()),
        shareReplay({ bufferSize: 1, refCount: false }),
      )
      .subscribe((data) => (this.host.data = data));
    this.host.sort.pipe(takeUntil(this.destroy$)).subscribe((event: SortEvent) => this.sorting$.next(event));
  }

  private createSorterByColumn({ column, direction }: SortEvent): (a: UntypedFormGroup, b: UntypedFormGroup) => number {
    return (a, b) => {
      switch (column) {
        case 'name':
          return (
            this.userFullNamePipe
              .transform(a.value)
              .localeCompare(this.userFullNamePipe.transform(b.value), 'en-GB', { sensitivity: 'base' }) *
            (direction === 'ascending' ? 1 : -1)
          );
        case 'createdDate':
          return !a.value.authorityCreationDate
            ? 1
            : !b.value.authorityCreationDate
            ? -1
            : new Date(a.value.authorityCreationDate).valueOf() - new Date(b.value.authorityCreationDate).valueOf();
      }
    };
  }

  private setFormArray(controls: UntypedFormGroup[]): void {
    this.form.setControl(this.formArrayName, this.fb.array(controls, { validators: this.formArray.validator }));
  }
}
