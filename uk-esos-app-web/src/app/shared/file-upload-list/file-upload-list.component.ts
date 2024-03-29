import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { FileUploadEvent } from '../file-input/file-upload-event';

@Component({
  selector: 'esos-file-upload-list',
  templateUrl: './file-upload-list.component.html',
  styleUrls: ['../multiple-file-input/multiple-file-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadListComponent {
  @Input() headerSize: 'm' | 's' = 'm';
  @Input() listTitle: string;
  @Input() files: FileUploadEvent[] = [];
  @Input() isDisabled = false;
  @Output() readonly fileDelete = new EventEmitter<number>();
}
