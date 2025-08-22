import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { BehaviorSubject, combineLatest, distinctUntilChanged, map, switchMap } from 'rxjs';

import { MoreLessComponent } from '@shared/more-less/more-less.component';
import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';
import { SharedModule } from '@shared/shared.module';

import { PaginationComponent } from 'govuk-components';

import { AccountNoteDto, AccountNotesService } from 'esos-api';

@Component({
  selector: 'esos-account-notes',
  templateUrl: './account-notes.component.html',
  styles: [
    `
      :host ::ng-deep .note-line-width {
        max-width: 610px !important;
      }
    `,
  ],
  standalone: true,
  imports: [GovukDatePipe, MoreLessComponent, PaginationComponent, RouterLink, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountNotesComponent {
  readonly pageSize = 10;
  page$ = new BehaviorSubject<number>(1);
  accountNotes$ = combineLatest([
    this.route.paramMap.pipe(map((parameters) => +parameters.get('accountId'))),
    this.page$.pipe(distinctUntilChanged()),
  ]).pipe(
    switchMap(([accountId, page]) => this.accountNotesService.getNotesByAccountId(accountId, page - 1, this.pageSize)),
  );

  constructor(private readonly accountNotesService: AccountNotesService, private readonly route: ActivatedRoute) {}

  getDownloadUrlFiles(note: AccountNoteDto): { downloadUrl: string; fileName: string }[] {
    const files = note.payload.files || {};

    return (
      Object.keys(files)?.map((uuid) => ({
        downloadUrl: `./file-download/${uuid}`,
        fileName: files[uuid],
      })) ?? []
    );
  }
}
