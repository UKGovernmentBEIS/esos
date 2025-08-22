import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@common/forms/services/task.service';
import { ProgressUpdate1Service } from '@tasks/progress-update-1/services/progress-update-1.service';
import { ActivatedRouteStub, BasePage, MockType } from '@testing';

import { ProgressUpdate1SubmitActionComponent } from './action.component';

describe('ProgressUpdate1SubmitActionComponent', () => {
  let component: ProgressUpdate1SubmitActionComponent;
  let fixture: ComponentFixture<ProgressUpdate1SubmitActionComponent>;
  let page: Page;

  const activatedRoute = new ActivatedRouteStub();

  const taskService: MockType<ProgressUpdate1Service> = {
    submit: jest.fn().mockImplementation(),
  };

  class Page extends BasePage<ProgressUpdate1SubmitActionComponent> {
    get submitButton() {
      return this.query<HTMLButtonElement>('button[type="button"]');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    });
    fixture = TestBed.createComponent(ProgressUpdate1SubmitActionComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit and navigate to confirmation page', () => {
    const taskServiceSpy = jest.spyOn(taskService, 'submit');

    page.submitButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledWith({
      subtask: 'submit',
      currentStep: 'action',
      route: activatedRoute,
    });
  });
});
