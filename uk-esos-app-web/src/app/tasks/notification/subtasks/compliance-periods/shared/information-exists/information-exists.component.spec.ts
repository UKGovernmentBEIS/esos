import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { SideEffectsHandler } from '@common/forms/side-effects';
import { RequestTaskStore } from '@common/request-task/+state';
import { WIZARD_STEP_HEADINGS } from '@shared/components/summaries';
import {
  provideNotificationSideEffects,
  provideNotificationStepFlowManagers,
  provideNotificationTaskServices,
} from '@tasks/notification/notification.providers';
import {
  COMPLIANCE_PERIOD_SUB_TASK,
  CompliancePeriodSubtask,
} from '@tasks/notification/subtasks/compliance-periods/compliance-period.token';
import { InformationExistsComponent } from '@tasks/notification/subtasks/compliance-periods/shared/information-exists/information-exists.component';
import { mockFirstCompliancePeriod, mockStateBuild } from '@tasks/notification/testing/mock-data';
import { TaskItemStatus } from '@tasks/task-item-status';
import { ActivatedRouteStub, BasePage } from '@testing';

describe('InformationExistsComponent', () => {
  let component: InformationExistsComponent;
  let fixture: ComponentFixture<InformationExistsComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const activatedRoute = new ActivatedRouteStub();

  class Page extends BasePage<InformationExistsComponent> {
    get caption() {
      return this.query<HTMLSpanElement>('span[class^="govuk-caption-"]');
    }

    get heading1(): HTMLHeadingElement {
      return this.query<HTMLHeadingElement>('h1');
    }

    get informationExists() {
      return this.query('div[govuk-radio]');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideNotificationTaskServices(),
        provideNotificationSideEffects(),
        provideNotificationStepFlowManagers(),
        RequestTaskStore,
        SideEffectsHandler,
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: COMPLIANCE_PERIOD_SUB_TASK, useValue: CompliancePeriodSubtask.FIRST },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setState(
      mockStateBuild(
        { firstCompliancePeriod: mockFirstCompliancePeriod },
        { firstCompliancePeriod: TaskItemStatus.IN_PROGRESS },
      ),
    );

    fixture = TestBed.createComponent(InformationExistsComponent);
    component = fixture.componentInstance;
    component.isFirstCompliancePeriod = true;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct caption based on compliance period', () => {
    expect(page.caption.textContent.trim()).toEqual('First compliance period');
  });

  it('should display heading the form field', () => {
    expect(page.heading1.textContent.trim()).toEqual(WIZARD_STEP_HEADINGS['information-exists'](true));
    expect(page.informationExists).toBeTruthy();
  });
});
