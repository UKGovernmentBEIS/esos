import { HttpEvent } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  BehaviorSubject,
  combineLatest,
  filter,
  first,
  map,
  Observable,
  switchMap,
  takeUntil,
  withLatestFrom,
} from 'rxjs';

import { PendingRequestService } from '@core/guards/pending-request.service';
import { DestroySubject } from '@core/services/destroy-subject.service';
import { BusinessErrorService } from '@error/business-error/business-error.service';
import { catchTaskReassignedBadRequest } from '@error/business-errors';
import { requestTaskReassignedError } from '@shared/errors/request-task-error';
import { FileUploadService } from '@shared/file-input/file-upload.service';
import { createCommonFileAsyncValidators } from '@shared/file-input/file-validators';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { PendingButtonDirective } from '@shared/pending-button.directive';
import { SharedModule } from '@shared/shared.module';

import { GovukValidators } from 'govuk-components';

import { FileUuidDTO, NotePayload, RequestNotesService } from 'esos-api';

import { WorkflowItemAbstractComponent } from '../../workflow-item-abstract.component';

@Component({
  selector: 'esos-request-note',
  templateUrl: './request-note.component.html',
  standalone: true,
  imports: [PageHeadingComponent, SharedModule, PendingButtonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroySubject],
})
export class RequestNoteComponent extends WorkflowItemAbstractComponent implements OnInit {
  isErrorSummaryDisplayed$ = new BehaviorSubject<boolean>(false);
  noteId$ = this.route.paramMap.pipe(map((parameters) => +parameters.get('noteId')));
  notePayload$: Observable<NotePayload> = this.noteId$.pipe(
    filter((noteId) => !!noteId),
    switchMap((noteId) => this.requestNotesService.getRequestNote(noteId)),
    map((result) => result.payload),
  );

  fileDownloadUrl$: Observable<string>;

  form = this.fb.group({
    note: [
      '',
      [GovukValidators.required('Enter a note'), GovukValidators.maxLength(10000, 'Enter up to 10000 characters')],
    ],
    files: this.fb.control(
      {
        value: [],
        disabled: false,
      },
      {
        asyncValidators: [
          ...createCommonFileAsyncValidators(false),
          this.fileUploadService.uploadMany((file) => this.uploadFile(file)),
        ],
        updateOn: 'change',
      },
    ),
  });

  constructor(
    protected readonly router: Router,
    protected readonly route: ActivatedRoute,
    protected readonly destroy$: DestroySubject,
    private readonly fb: UntypedFormBuilder,
    private readonly requestNotesService: RequestNotesService,
    private readonly fileUploadService: FileUploadService,
    private readonly businessErrorService: BusinessErrorService,
    private readonly pendingRequest: PendingRequestService,
  ) {
    super(router, route);
  }

  ngOnInit(): void {
    this.fileDownloadUrl$ = this.prefixUrl$.pipe(
      withLatestFrom(this.accountId$, this.requestId$),
      takeUntil(this.destroy$),
      map(([prefixUrl, accountId, requestId]) =>
        accountId ? `${prefixUrl}/workflows/${requestId}/file-download/` : `${prefixUrl}/${requestId}/file-download/`,
      ),
    );

    this.notePayload$.pipe(first()).subscribe((payload) => {
      this.form.patchValue({
        note: payload?.note,
        files: this.transformFiles(payload?.files),
      });
    });
  }

  transformFiles(transformedFiles: NotePayload['files']) {
    return transformedFiles
      ? Object.entries(transformedFiles).map((keyValue) => ({
          uuid: keyValue[0],
          file: {
            name: keyValue[1],
          },
        }))
      : [];
  }

  onSubmit() {
    if (this.form.valid) {
      const note = this.form.get('note').value;
      const files = this.form.get('files').value?.map((file) => file.uuid);

      combineLatest([this.requestId$, this.noteId$])
        .pipe(
          first(),
          switchMap(([requestId, noteId]) => {
            return noteId
              ? this.requestNotesService.updateRequestNote(noteId, { note, files })
              : this.requestNotesService.createRequestNote({ requestId, note, files });
          }),
          withLatestFrom(this.accountId$, this.prefixUrl$, this.requestId$),
          this.pendingRequest.trackRequest(),
        )
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        .subscribe(([response, accountId, prefixUrl, requestId]) =>
          this.router.navigate([accountId ? `${prefixUrl}/workflows/${requestId}` : `${prefixUrl}/${requestId}`], {
            fragment: 'notes',
          }),
        );
    } else {
      this.isErrorSummaryDisplayed$.next(true);
    }
  }

  private uploadFile(file: File): Observable<HttpEvent<FileUuidDTO>> {
    const requestId = this.route.snapshot.paramMap.get('request-id');
    return this.requestNotesService
      .uploadRequestNoteFile(requestId, file, 'events', true)
      .pipe(
        catchTaskReassignedBadRequest(() =>
          this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
        ),
      );
  }
}
