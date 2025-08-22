import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@testing';

import { NotificationReturnToSubmitTaskButtonsComponent } from './return-to-submit-task-buttons.component';

describe('ReturnToSubmitTaskButtonsComponent', () => {
  let component: NotificationReturnToSubmitTaskButtonsComponent;
  let fixture: ComponentFixture<NotificationReturnToSubmitTaskButtonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    });
    fixture = TestBed.createComponent(NotificationReturnToSubmitTaskButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
