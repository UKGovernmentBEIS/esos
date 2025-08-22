import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { mockStateBuild } from '@tasks/notification/testing/mock-data';
import { ActivatedRouteStub } from '@testing';

import { ProgressUpdate2SubmitConfirmationComponent } from './confirmation.component';

describe('ProgressUpdate2SubmitConfirmationComponent', () => {
  let component: ProgressUpdate2SubmitConfirmationComponent;
  let fixture: ComponentFixture<ProgressUpdate2SubmitConfirmationComponent>;
  let store: RequestTaskStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestTaskStore, { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockStateBuild());

    fixture = TestBed.createComponent(ProgressUpdate2SubmitConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
