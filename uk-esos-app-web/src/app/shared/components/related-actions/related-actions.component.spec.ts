import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Route, RouterModule } from '@angular/router';

import { RelatedActionsComponent } from '@shared/components/related-actions/related-actions.component';
import { BasePage } from '@testing';

import { RequestTaskActionProcessDTO } from 'esos-api';

describe('RelatedActionsComponent', () => {
  let component: RelatedActionsComponent;
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let page: Page;

  @Component({
    template: `
      <esos-related-actions
        [taskId]="taskId"
        [isAssignable]="isAssignable"
        [allowedActions]="allowedActions"
      ></esos-related-actions>
    `,
    standalone: true,
    imports: [RelatedActionsComponent],
  })
  class TestComponent {
    taskId: number;
    isAssignable: boolean;
    allowedActions: Array<RequestTaskActionProcessDTO['requestTaskActionType']>;
  }

  class Page extends BasePage<TestComponent> {
    get links() {
      return this.queryAll<HTMLLinkElement>('li > a');
    }
  }

  const setupTestingModule = async (withChangeAssigneeRoute = false) => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), TestComponent],
      providers: [{ provide: ActivatedRoute, useValue: constructRoute(withChangeAssigneeRoute) }],
    }).compileComponents();
  };

  const createComponent = () => {
    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    testComponent.isAssignable = true;
    testComponent.taskId = 1;
    testComponent.allowedActions = [];
    component = fixture.debugElement.query(By.directive(RelatedActionsComponent)).componentInstance;
    page = new Page(fixture);
  };

  it('should create', async () => {
    await setupTestingModule();
    createComponent();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the links', async () => {
    await setupTestingModule();
    createComponent();
    fixture.detectChanges();

    expect(page.links.map((el) => [el.href, el.textContent])).toEqual([['http://localhost/', 'Reassign task']]);
  });

  it('should display the links with actions', async () => {
    await setupTestingModule();
    createComponent();

    testComponent.allowedActions = [
      'RFI_SUBMIT',
      'RDE_SUBMIT',
      'ACCOUNT_CLOSURE_CANCEL_APPLICATION',
      'ACTION_PLAN_CANCEL_APPLICATION',
      'PROGRESS_UPDATE_1_CANCEL_APPLICATION',
      'PROGRESS_UPDATE_2_CANCEL_APPLICATION',
    ];
    fixture.detectChanges();

    expect(page.links.map((el) => [el.href, el.textContent])).toEqual([
      ['http://localhost/', 'Reassign task'],
      ['http://localhost/rfi/1/questions', 'Request for information'],
      ['http://localhost/rde/1/extend-determination', 'Request deadline extension'],
      ['http://localhost/', 'Cancel task'],
      ['http://localhost/', 'Cancel task'],
      ['http://localhost/', 'Cancel task'],
      ['http://localhost/', 'Cancel task'],
    ]);
  });
});

function constructRoute(withChangeAssignee = false): Partial<ActivatedRoute> {
  return {
    snapshot: {
      get routeConfig() {
        return { path: '' };
      },
      get parent(): any {
        return {
          get routeConfig(): Route | null {
            return {
              path: 'parent',
              children: [{ path: withChangeAssignee ? 'change-assignee' : '' }],
            };
          },
        };
      },
    } as any,
  };
}
