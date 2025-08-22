import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let hostComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;
  let route: ActivatedRoute;

  const getActiveLinks = () => element.querySelectorAll<HTMLAnchorElement>('li a.govuk-pagination__link');
  const getCurrentLink = () => element.querySelector<HTMLAnchorElement>('li.govuk-pagination__item--current a');
  const getPreviousButton = () => element.querySelector<HTMLAnchorElement>('.govuk-pagination__prev a');
  const getNextButton = () => element.querySelector<HTMLAnchorElement>('.govuk-pagination__next a');
  const getEllipsisItems = () => element.querySelectorAll<HTMLLIElement>('li.govuk-pagination__item--ellipses');
  const getDetails = () =>
    Array.from(element.querySelector('.govuk-body').querySelectorAll('strong')).map((text) => text.textContent);

  @Component({
    standalone: true,
    template: `
      <govuk-pagination
        [count]="count"
        [pageSize]="pageSize"
        (currentPageChange)="this.currentPage = $event"
      ></govuk-pagination>
    `,
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'test-pagination',
    imports: [PaginationComponent],
  })
  class TestComponent {
    count;
    pageSize;
    currentPage;
  }

  @Component({
    standalone: true,
    imports: [RouterOutlet],
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'test-pagination-router',
    template: '<router-outlet></router-outlet>',
  })
  class RouterComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent, RouterTestingModule.withRoutes([{ path: '', component: TestComponent }])],
    }).compileComponents();
  });

  beforeEach(() => {
    TestBed.createComponent(RouterComponent);
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.debugElement.query(By.directive(PaginationComponent)).componentInstance;
    hostComponent = fixture.componentInstance;
    element = fixture.nativeElement;
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total pages', () => {
    expect(getActiveLinks().length).toEqual(0);

    hostComponent.count = 36;
    hostComponent.pageSize = 10;
    fixture.detectChanges();

    expect(getActiveLinks().length).toEqual(4);
    expect(component.pageNumbers).toEqual([1, 2, 3, 4]);

    hostComponent.count = 53;
    hostComponent.pageSize = 10;
    fixture.detectChanges();

    expect(getActiveLinks().length).toEqual(6);
    expect(component.pageNumbers).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should emit currentPage', async () => {
    const links = getCurrentLink();
    expect(hostComponent.currentPage).toEqual(1);
    expect(links).toBeFalsy;

    hostComponent.count = 36;
    hostComponent.pageSize = 10;
    fixture.detectChanges();

    const page3 = getActiveLinks()[1];
    expect(page3.textContent.trim()).toEqual('2');

    page3.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(route.snapshot.queryParamMap.get('page')).toEqual('2');
    expect(hostComponent.currentPage).toEqual(2);
  });

  it('should show dots for a large amount of pages', async () => {
    hostComponent.count = 126;
    hostComponent.pageSize = 10;
    fixture.detectChanges();

    expect(getEllipsisItems()?.length).toEqual(1);
    expect(getActiveLinks()?.length).toEqual(3);
    expect(getNextButton()).toBeTruthy();
  });

  it('should limit page size to the current count', () => {
    hostComponent.count = 3;
    hostComponent.pageSize = 10;
    fixture.detectChanges();

    expect(getDetails()).toEqual(['1', '3', '3']);

    hostComponent.count = 15;
    hostComponent.pageSize = 10;
    fixture.detectChanges();

    getActiveLinks()[1].click();
    fixture.detectChanges();

    expect(getDetails()).toEqual(['11', '15', '15']);
  });

  it('should not show previous on first page or next on last page', () => {
    hostComponent.count = 30;
    hostComponent.pageSize = 10;
    fixture.detectChanges();

    expect(getPreviousButton()).toBeFalsy();
    expect(getNextButton()).toBeTruthy();

    getActiveLinks()[0].click();
    fixture.detectChanges();

    expect(getPreviousButton()).toBeFalsy();
    expect(getNextButton()).toBeTruthy();

    getActiveLinks()[2].click();
    fixture.detectChanges();

    expect(getPreviousButton()).toBeTruthy();
    expect(getNextButton()).toBeFalsy();
  });

  it('should not display a page if no results exist', () => {
    hostComponent.count = 0;
    hostComponent.pageSize = 0;
    fixture.detectChanges();

    expect(getActiveLinks().length).toEqual(0);
  });
});
