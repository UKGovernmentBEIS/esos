import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { of } from 'rxjs';

import { StatusTagColorPipe } from '@common/request-task/pipes/status-tag-color';
import { AuthStore } from '@core/store';
import { RelatedTasksComponent } from '@shared/components/related-tasks/related-tasks.component';
import { TimelineComponent } from '@shared/components/timeline/timeline.component';
import { TimelineItemComponent } from '@shared/components/timeline/timeline-item.component';
import { PageHeadingComponent } from '@shared/page-heading/page-heading.component';
import { ItemLinkPipe } from '@shared/pipes/item-link.pipe';
import { TimelineItemLinkPipe } from '@shared/pipes/timeline-item-link.pipe';
import { SharedModule } from '@shared/shared.module';
import { ActivatedRouteStub, BasePage, mockClass } from '@testing';

import { RequestActionsService, RequestItemsService, RequestsService } from 'esos-api';

import { RequestNotesComponent } from './notes/request-notes.component';
import { WorkflowItemComponent } from './workflow-item.component';
import { WorkflowRelatedCreateActionsComponent } from './workflow-related-create-actions/workflow-related-create-actions.component';

describe('WorkflowItemComponent', () => {
  let component: WorkflowItemComponent;
  let fixture: ComponentFixture<WorkflowItemComponent>;
  let page: Page;
  let authStore: AuthStore;

  const requestsService = mockClass(RequestsService);
  const requestItemsService = mockClass(RequestItemsService);
  const requestActionsService = mockClass(RequestActionsService);

  class Page extends BasePage<WorkflowItemComponent> {
    get heading() {
      return this.query<HTMLElement>('esos-page-heading h1.govuk-heading-xl');
    }
    get tasks() {
      return this.queryAll<HTMLElement>('esos-related-tasks h3');
    }
    get timeline() {
      return this.queryAll<HTMLElement>('esos-timeline-item h3');
    }
    get relatedCreateActions() {
      return this.queryAll<HTMLLIElement>('esos-workflow-related-create-actions ul > li');
    }
  }

  const createComponent = async () => {
    fixture = TestBed.createComponent(WorkflowItemComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  };

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('for account workflow item', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          SharedModule,
          RouterModule.forRoot([]),
          StatusTagColorPipe,
          TimelineItemLinkPipe,
          PageHeadingComponent,
          RelatedTasksComponent,
          TimelineComponent,
          TimelineItemComponent,
          WorkflowRelatedCreateActionsComponent,
          RequestNotesComponent,
        ],
        providers: [
          { provide: ActivatedRoute, useValue: new ActivatedRouteStub({ accountId: 1, 'request-id': '1' }) },
          { provide: RequestsService, useValue: requestsService },
          { provide: RequestItemsService, useValue: requestItemsService },
          { provide: RequestActionsService, useValue: requestActionsService },
          ItemLinkPipe,
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    });

    describe('display all info', () => {
      beforeEach(() => {
        authStore = TestBed.inject(AuthStore);
        authStore.setUserState({
          ...authStore.getState().userState,
          status: 'ENABLED',
          roleType: 'REGULATOR',
          userId: 'opTestId',
        });

        requestsService.getRequestDetailsById.mockReturnValue(
          of({
            id: '1',
            requestType: 'ORGANISATION_ACCOUNT_OPENING',
            requestStatus: 'IN_PROGRESS',
            creationDate: '22-2-2022',
          }),
        );

        requestItemsService.getItemsByRequest.mockReturnValue(
          of({
            items: [
              {
                taskId: 1,
                requestType: 'ORGANISATION_ACCOUNT_OPENING',
                taskType: 'ORGANISATION_ACCOUNT_OPENING_ARCHIVE',
              },
              {
                taskId: 2,
                requestType: 'ORGANISATION_ACCOUNT_OPENING',
                taskType: 'ACCOUNT_USERS_SETUP',
              },
            ],
          } as any),
        );

        requestActionsService.getRequestActionsByRequestId.mockReturnValue(
          of([
            {
              id: 1,
              creationDate: '2020-08-25 10:36:15.189643',
              submitter: 'Operator',
              type: 'ORGANISATION_ACCOUNT_OPENING_APPLICATION_SUBMITTED',
            },
          ]),
        );
      });
      beforeEach(createComponent);

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should display request details', () => {
        expect(page.heading.textContent.trim()).toEqual('Account Creation IN PROGRESS');
      });

      it('should display tasks to complete', () => {
        expect(page.tasks).toBeTruthy();
        expect(page.tasks.map((el) => el.textContent.trim())).toEqual(['', '']);
      });

      it('should display timeline', () => {
        expect(page.timeline).toBeTruthy();
        expect(page.timeline.map((el) => el.textContent.trim())).toEqual([
          'Original application submitted by Operator',
        ]);
      });
    });

    describe('display only request details', () => {
      beforeEach(() => {
        requestsService.getRequestDetailsById.mockReturnValue(
          of({
            id: '1',
            requestType: 'ORGANISATION_ACCOUNT_OPENING',
            requestStatus: 'COMPLETED',
            creationDate: '22-2-2022',
          }),
        );

        requestItemsService.getItemsByRequest.mockReturnValue(of({}));

        requestActionsService.getRequestActionsByRequestId.mockReturnValue(of([]));
      });
      beforeEach(createComponent);

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should display request details', () => {
        expect(page.heading.textContent.trim()).toEqual('Account Creation COMPLETED');
      });

      it('should not display any task to complete', () => {
        expect(page.tasks).toBeTruthy();
        expect(page.tasks.map((el) => el.textContent)).toEqual([]);
      });

      it('should not display timeline', () => {
        expect(page.timeline).toBeTruthy();
        expect(page.timeline.map((el) => el.textContent)).toEqual([]);
      });
    });
  });
});
