import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { TaskHeaderInfoComponent } from '@shared/components/task-header-info/task-header-info.component';
import { BasePage } from '@testing';

import { SharedModule } from '../../shared.module';

describe('TaskHeaderInfoComponent', () => {
  let component: TaskHeaderInfoComponent;
  let fixture: ComponentFixture<TaskHeaderInfoComponent>;
  let page: Page;

  class Page extends BasePage<TaskHeaderInfoComponent> {
    get info() {
      return this.queryAll<HTMLParagraphElement>('p');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), SharedModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskHeaderInfoComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the content', () => {
    component.assignee = 'Adam Smith';
    component.daysRemaining = 13;
    fixture.detectChanges();

    expect(page.info.map((el) => el.textContent.trim())).toEqual(['Assigned to: Adam Smith', 'Days Remaining: 13']);
  });

  it('should display the content with no deadline', () => {
    component.assignee = 'Adam Smith';
    component.daysRemaining = null;
    fixture.detectChanges();

    expect(page.info.map((el) => el.textContent.trim())).toEqual(['Assigned to: Adam Smith']);
  });

  it('should display the content with no assignee', () => {
    component.assignee = null;
    component.daysRemaining = 13;
    fixture.detectChanges();

    expect(page.info.map((el) => el.textContent.trim())).toEqual(['Assigned to: Unassigned', 'Days Remaining: 13']);
  });
});
