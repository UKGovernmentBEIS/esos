import { TestBed } from '@angular/core/testing';
import { provideRouter, Routes } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { ITEM_TYPE_TO_RETURN_TEXT_MAPPER, TYPE_AWARE_STORE } from '@common/store';
import { screen } from '@testing-library/angular';

import { RequestTaskStore } from '../../../request-task/+state';
import { ReturnToTaskOrActionPageComponent } from './return-to-task-or-action-page.component';

const routes: Routes = [
  {
    path: 'tasks',
    children: [
      {
        path: ':taskId',
        children: [{ path: 'subtask', component: ReturnToTaskOrActionPageComponent }],
      },
    ],
  },
];

describe('ReturnToTaskOrActionPageComponent', () => {
  let store: RequestTaskStore;
  let component: ReturnToTaskOrActionPageComponent;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        { provide: TYPE_AWARE_STORE, useExisting: RequestTaskStore },
        { provide: ITEM_TYPE_TO_RETURN_TEXT_MAPPER, useValue: () => 'TEST RETURN' },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setRequestTaskItem({ requestTask: { type: 'TEST_TYPE' as any } });

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/tasks/1/subtask', ReturnToTaskOrActionPageComponent);
    harness.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct link and text', () => {
    const link = screen.getByRole('link') as HTMLAnchorElement;
    expect(link.href).toEqual('http://localhost/tasks/1');
    expect(link.innerHTML.trim()).toEqual('Return to: TEST RETURN');
  });
});
