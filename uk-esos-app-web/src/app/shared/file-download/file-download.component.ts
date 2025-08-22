import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { combineLatest, expand, map, Observable, of, switchMap, timer } from 'rxjs';

import {
  FileAttachmentsService,
  FileDocumentsService,
  FileToken,
  RequestActionAttachmentsHandlingService,
  RequestActionFileDocumentsHandlingService,
  RequestTaskAttachmentsHandlingService,
} from 'esos-api';

export interface FileDownloadInfo {
  request: Observable<FileToken>;
  fileType: 'attachment' | 'document';
}

@Component({
  selector: 'esos-file-download',
  template: `
    <h1 class="govuk-heading-l">Your download has started</h1>
    <p class="govuk-body">You should see your downloads in the downloads folder.</p>
    <a govukLink [href]="url$ | async" download #anchor>Click to restart download if it fails</a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileDownloadComponent implements AfterViewChecked {
  @ViewChild('anchor') readonly anchor: ElementRef<HTMLAnchorElement>;

  private hasDownloadedOnce = false;
  private fileDownloadAttachmentPath = `${this.fileAttachmentsService.configuration.basePath}/v1.0/file-attachments/`;
  private fileDownloadDocumentPath = `${this.fileDocumentsService.configuration.basePath}/v1.0/file-documents/`;

  url$ = this.route.paramMap.pipe(
    map((params): FileDownloadInfo => {
      return params.has('taskId') ? this.requestTaskDownloadInfo(params) : this.requestActionDownloadInfo(params);
    }),
    switchMap(({ request, fileType }) => {
      return combineLatest([
        of(fileType),
        request.pipe(
          expand((response) => timer(response.tokenExpirationMinutes * 1000 * 60).pipe(switchMap(() => request))),
        ),
      ]);
    }),
    map(([fileType, fileToken]) => {
      return fileType === 'attachment'
        ? `${this.fileDownloadAttachmentPath}${encodeURIComponent(String(fileToken.token))}`
        : `${this.fileDownloadDocumentPath}${encodeURIComponent(String(fileToken.token))}`;
    }),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly requestTaskAttachmentsHandlingService: RequestTaskAttachmentsHandlingService,
    private readonly requestActionAttachmentsHandlingService: RequestActionAttachmentsHandlingService,
    private readonly requestActionFileDocumentsHandlingService: RequestActionFileDocumentsHandlingService,
    private readonly fileAttachmentsService: FileAttachmentsService,
    private readonly fileDocumentsService: FileDocumentsService,
  ) {}

  ngAfterViewChecked(): void {
    if (
      (this.anchor.nativeElement.href.includes(this.fileDownloadAttachmentPath) ||
        this.anchor.nativeElement.href.includes(this.fileDownloadDocumentPath)) &&
      !this.hasDownloadedOnce
    ) {
      this.anchor.nativeElement.click();
      this.hasDownloadedOnce = true;
      onfocus = () => close();
    }
  }

  private requestTaskDownloadInfo(params: ParamMap): FileDownloadInfo {
    return {
      request: this.requestTaskAttachmentsHandlingService.generateRequestTaskGetFileAttachmentToken(
        Number(params.get('taskId')),
        params.get('uuid'),
      ),
      fileType: 'attachment',
    };
  }

  private requestActionDownloadInfo(params: ParamMap): FileDownloadInfo {
    if (params.get('fileType') === 'document') {
      return {
        request: this.requestActionFileDocumentsHandlingService.generateRequestActionGetFileDocumentToken(
          Number(params.get('actionId')),
          params.get('uuid'),
        ),
        fileType: 'document',
      };
    } else {
      return {
        request: this.requestActionAttachmentsHandlingService.generateRequestActionGetFileAttachmentToken(
          Number(params.get('actionId')),
          params.get('uuid'),
        ),
        fileType: 'attachment',
      };
    }
  }
}
