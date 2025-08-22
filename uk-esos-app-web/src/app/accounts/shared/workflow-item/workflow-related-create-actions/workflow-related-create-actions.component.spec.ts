import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of } from 'rxjs';

import { ItemLinkPipe } from '@shared/pipes/item-link.pipe';
import { BasePage, mockClass } from '@testing';

import { RequestCreateActionProcessDTO, RequestItemsService, RequestsService } from 'esos-api';

import { WorkflowRelatedCreateActionsComponent } from './workflow-related-create-actions.component';

describe('WorkflowRelatedCreateActionsComponent', () => {
  let component: WorkflowRelatedCreateActionsComponent;
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let page: Page;

  const requestService = mockClass(RequestsService);
  const requestItemsService = mockClass(RequestItemsService);

  @Component({
    template: `
      <esos-workflow-related-create-actions
        [accountId$]="accountId$"
        [requestId$]="requestId$"
        [requestCreateActionsTypes$]="requestCreateActionsTypes$"
      ></esos-workflow-related-create-actions>
    `,
  })
  class TestComponent {
    accountId$: Observable<number>;
    requestId$: Observable<string>;
    requestCreateActionsTypes$: Observable<RequestCreateActionProcessDTO['requestCreateActionType'][]>;
  }

  class Page extends BasePage<TestComponent> {
    get links() {
      return this.queryAll<HTMLLinkElement>('li > a');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, WorkflowRelatedCreateActionsComponent],
      declarations: [TestComponent],
      providers: [
        { provide: RequestsService, useValue: requestService },
        { provide: RequestItemsService, useValue: requestItemsService },
        ItemLinkPipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    testComponent.accountId$ = of(1);
    testComponent.requestId$ = of('AEM00001-2022');
    testComponent.requestCreateActionsTypes$ = of([]);
    component = fixture.debugElement.query(By.directive(WorkflowRelatedCreateActionsComponent)).componentInstance;
    page = new Page(fixture);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not display any links', () => {
    fixture.detectChanges();
    expect(page.links).toEqual([]);
  });
});
