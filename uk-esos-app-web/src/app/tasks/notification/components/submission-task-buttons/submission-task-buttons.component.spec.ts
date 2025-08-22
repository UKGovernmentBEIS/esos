import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { mockStateBuild } from '@tasks/notification/testing/mock-data';
import { ActivatedRouteStub } from '@testing';

import { NotificationSubmissionTaskButtonsComponent } from './submission-task-buttons.component';

describe('SubmissionTaskButtonsComponent', () => {
  let component: NotificationSubmissionTaskButtonsComponent;
  let fixture: ComponentFixture<NotificationSubmissionTaskButtonsComponent>;
  let store: RequestTaskStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestTaskStore, { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockStateBuild());

    fixture = TestBed.createComponent(NotificationSubmissionTaskButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
