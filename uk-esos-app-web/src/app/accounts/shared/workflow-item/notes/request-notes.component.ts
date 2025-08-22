import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { BehaviorSubject, combineLatest, distinctUntilChanged, map, switchMap } from 'rxjs';

import { MoreLessComponent } from '@shared/more-less/more-less.component';
import { GovukDatePipe } from '@shared/pipes/govuk-date.pipe';
import { SharedModule } from '@shared/shared.module';

import { RequestNoteDto, RequestNotesService } from 'esos-api';

@Component({
  selector: 'esos-request-notes',
  templateUrl: './request-notes.component.html',
  styleUrls: ['./request-notes.component.scss'],
  standalone: true,
  imports: [GovukDatePipe, MoreLessComponent, RouterLink, SharedModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestNotesComponent {
  @Input() currentTab: string;

  readonly pageSize = 10;
  page$ = new BehaviorSubject<number>(1);
  requestId$ = this.route.paramMap.pipe(map((paramMap) => paramMap.get('request-id')));

  requestNotes$ = combineLatest([this.requestId$, this.page$.pipe(distinctUntilChanged())]).pipe(
    switchMap(([requestId, page]) => this.requestNotesService.getNotesByRequestId(requestId, page - 1, this.pageSize)),
  );

  constructor(private readonly requestNotesService: RequestNotesService, private readonly route: ActivatedRoute) {}

  getDownloadUrlFiles(note: RequestNoteDto): { downloadUrl: string; fileName: string }[] {
    const files = note.payload.files || {};

    return (
      Object.keys(files)?.map((uuid) => ({
        downloadUrl: `./file-download/${uuid}`,
        fileName: files[uuid],
      })) ?? []
    );
  }
}
