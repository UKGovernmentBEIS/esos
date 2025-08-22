import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { tasks } from '../testing';
import { TaskItemComponent } from './task-item.component';

describe('TaskItemComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  @Component({
    template: `
      <ul class="app-task-list__items">
        <li
          esos-task-item
          *ngFor="let task of taskItems"
          [link]="task.link"
          [linkText]="task.linkText"
          [status]="task.status"
          class="app-task-list__item"
        >
          <div class="custtmpl">tmpl</div>
        </li>
      </ul>
    `,
    standalone: true,
    imports: [TaskItemComponent, NgFor],
  })
  class TestComponent {
    taskItems = tasks;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), TaskItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the task items', () => {
    const element: HTMLElement = fixture.nativeElement;
    const items = element.querySelectorAll<HTMLUListElement>('li');
    const customTmpl = element.querySelector<HTMLDivElement>('div.custtmpl');

    expect(items.length).toEqual(4);
    items.forEach((item, index) => {
      if (tasks[index].status === 'CANNOT_START_YET') {
        expect(item.querySelector('a')).toBeFalsy();
      } else {
        expect(item.querySelector('a').href).toContain(tasks[index].link);
      }
      expect(item.querySelector('span').textContent.trim()).toEqual(tasks[index].linkText);
    });
    expect(items[0].querySelector('strong').classList.contains('govuk-tag--grey')).toBeTruthy();
    expect(items[1].querySelector('strong').classList.contains('govuk-tag--grey')).toBeTruthy();
    expect(items[2].querySelector('strong').classList.contains('govuk-tag--blue')).toBeTruthy();
    expect(customTmpl.textContent.trim()).toContain('tmpl');
  });
});
