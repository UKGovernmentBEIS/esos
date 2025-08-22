import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskServiceExtended } from '@common/forms/services/task.service';
import { NotificationService } from '@tasks/notification/services/notification.service';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { ReturnToSubmitActionComponent } from './action.component';

describe('ActionComponent', () => {
  let component: ReturnToSubmitActionComponent;
  let fixture: ComponentFixture<ReturnToSubmitActionComponent>;
  let page: Page;

  const activatedRoute = new ActivatedRouteStub();

  const taskService: MockType<NotificationService> = {
    returnToSubmit: jest.fn().mockImplementation(),
  };

  class Page extends BasePage<ReturnToSubmitActionComponent> {
    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="button"]');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TaskServiceExtended, useValue: taskService },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    });
    fixture = TestBed.createComponent(ReturnToSubmitActionComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit and navigate to confirmation page', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'returnToSubmit');

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'returnToSubmit',
      currentStep: 'action',
      route: activatedRoute,
    });
  });
});
