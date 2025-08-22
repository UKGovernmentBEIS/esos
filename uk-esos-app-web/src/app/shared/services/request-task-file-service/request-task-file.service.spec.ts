import { HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { lastValueFrom, Observable } from 'rxjs';

import { Store } from '@core/store/store';
import { asyncData, mockClass } from '@testing';

import { RequestTaskAttachmentsHandlingService, TasksService } from 'esos-api';

import { RequestTaskFileService } from './request-task-file.service';

class MockedStore extends Store<MockedState> {
  constructor() {
    super(initialMockedState);
  }
}

interface MockedState {
  requestTaskId: number;
}

const initialMockedState: MockedState = {
  requestTaskId: 1,
};

describe('RequestTaskFileService', () => {
  let service: RequestTaskFileService;
  let attachmentsService: jest.Mocked<RequestTaskAttachmentsHandlingService>;

  const myMockedStore = new MockedStore();

  beforeEach(() => {
    attachmentsService = mockClass(RequestTaskAttachmentsHandlingService);
    attachmentsService.uploadRequestTaskAttachment.mockReturnValue(
      asyncData<any>(new HttpResponse({ body: { data: { uuid: 'xyz' } } })),
    );

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: RequestTaskAttachmentsHandlingService, useValue: attachmentsService },
        { provide: TasksService, useValue: mockClass(TasksService) },
      ],
    });
    service = TestBed.inject(RequestTaskFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload a single file', async () => {
    const control = new FormControl({ file: new File(['content'], 'file.txt') });
    await expect(
      lastValueFrom(
        service.upload(
          myMockedStore.getState().requestTaskId,
          'NOTIFICATION_OF_COMPLIANCE_P3_UPLOAD_ATTACHMENT',
        )(control) as Observable<ValidationErrors>,
      ),
    ).resolves.toBeNull();
  });

  it('should upload multiple files', () => {
    const control = new FormControl([{ file: new File(['content'], 'file.txt') }]);
    expect(
      lastValueFrom(
        service.uploadMany(
          myMockedStore.getState().requestTaskId,
          'NOTIFICATION_OF_COMPLIANCE_P3_UPLOAD_ATTACHMENT',
        )(control) as Observable<ValidationErrors>,
      ),
    ).resolves.toBeNull();
  });
});
