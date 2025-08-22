import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@common/request-task/+state';
import { mockStateBuild } from '@tasks/notification/testing/mock-data';
import { ActivatedRouteStub } from '@testing';

import { ActionPlanSubmissionTaskButtonsComponent } from './action-plan-submission-task-buttons.component';

describe('ActionPlanSubmissionTaskButtonsComponent', () => {
  let component: ActionPlanSubmissionTaskButtonsComponent;
  let fixture: ComponentFixture<ActionPlanSubmissionTaskButtonsComponent>;
  let store: RequestTaskStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestTaskStore, { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockStateBuild());

    fixture = TestBed.createComponent(ActionPlanSubmissionTaskButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
