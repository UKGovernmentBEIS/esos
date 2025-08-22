import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TableComponent } from './table.component';
import { GovukTableColumn, SortEvent } from './table.interface';

/* eslint-disable @typescript-eslint/no-unused-vars */
describe('TableComponent', () => {
  @Component({
    standalone: true,
    imports: [TableComponent],
    template: `
      <govuk-table [columns]="columns" [data]="data" [caption]="caption" (sort)="onSort($event)"></govuk-table>
    `,
  })
  class TestComponent {
    columns: GovukTableColumn[] = [
      { header: 'Name', field: 'name', widthClass: 'govuk-!-width-one-quarter', isHeader: true },
      { header: 'Surname', field: 'surname' },
      { header: 'Age', field: 'age' },
    ];
    data: any[] = [];
    caption: string;
    onSort = jest.fn((_: SortEvent) => null);
  }

  @Component({
    standalone: true,
    imports: [TableComponent, NgIf],
    template: `
      <govuk-table [columns]="columns" [data]="data" [caption]="caption" (sort)="onSort($event)">
        <ng-template let-column="column" let-row="row">
          <a *ngIf="column.field === 'link'; else plain">{{ row[column.field] }}</a>
          <ng-template #plain>{{ row[column.field] }}</ng-template>
        </ng-template>
      </govuk-table>
    `,
  })
  class TestTemplateComponent {
    columns: GovukTableColumn[] = [
      { header: 'Link', field: 'link' },
      { header: 'Text', field: 'text' },
    ];
    data: any[] = [];
    caption: string;
    onSort = jest.fn((_: SortEvent) => null);
  }

  let component: TableComponent<any>;
  let hostComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent, TestComponent, TestTemplateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(TableComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the caption', () => {
    const hostElement: HTMLElement = fixture.nativeElement;
    let caption = hostElement.querySelector<HTMLTableCaptionElement>('caption');

    expect(caption).toBeNull();

    hostComponent.caption = 'Test Caption';
    fixture.detectChanges();

    caption = hostElement.querySelector<HTMLTableCaptionElement>('caption');

    expect(caption).not.toBeNull();
    expect(caption.textContent).toContain('Test Caption');
  });

  it('should render the headers', () => {
    const hostElement: HTMLElement = fixture.nativeElement;
    const thead = hostElement.querySelector<HTMLElement>('thead');

    expect(thead).toBeTruthy();

    const headers = thead.querySelectorAll<HTMLTableCellElement>('th');

    expect(headers[0].innerHTML).toContain('Name');
    expect(headers[1].innerHTML).toContain('Surname');
    expect(headers[2].innerHTML).toContain('Age');
  });

  it('should render the data', () => {
    hostComponent.data = [
      { name: 'Name 1', surname: 'Surname 1', age: 23 },
      { name: 'Name 2', surname: 'Surname 2', age: 48 },
      { name: 'Name 3', surname: 'Surname 3', age: 32 },
    ];
    fixture.detectChanges();

    const hostElement: HTMLElement = fixture.nativeElement;
    const tbody = hostElement.querySelector<HTMLElement>('tbody');

    expect(tbody).toBeTruthy();

    const rows = tbody.querySelectorAll<HTMLTableRowElement>('tr');

    expect(rows.length).toEqual(3);

    expect(rows[0].querySelector<HTMLTableCellElement>('th').textContent).toContain('Name 1');
    expect(rows[2].querySelector<HTMLTableCellElement>('th').textContent).toContain('Name 3');

    expect(rows[1].querySelectorAll<HTMLTableCellElement>('td')[0].textContent).toContain('Surname 2');
    expect(rows[2].querySelectorAll<HTMLTableCellElement>('td')[1].textContent).toContain('32');
  });

  it('should assign width classes', () => {
    const hostElement: HTMLElement = fixture.nativeElement;
    const thead = hostElement.querySelector<HTMLElement>('thead');
    const headers = thead.querySelectorAll<HTMLTableCellElement>('th');

    expect(headers[0].classList).toContain('govuk-!-width-one-quarter');
  });

  it('should assign numeric class', () => {
    hostComponent.data = [
      { name: 'Name 1', surname: 'Surname 1', age: 23 },
      { name: 'Name 2', surname: 'Surname 2', age: 48 },
      { name: 'Name 3', surname: 'Surname 3', age: 32 },
    ];
    fixture.detectChanges();

    const hostElement: HTMLElement = fixture.nativeElement;
    const tds = hostElement.querySelectorAll<HTMLTableCellElement>('td');

    expect(tds[0].classList).not.toContain('govuk-table__cell--numeric');
    expect(tds[1].classList).toContain('govuk-table__cell--numeric');
    expect(tds[2].classList).not.toContain('govuk-table__cell--numeric');
    expect(tds[3].classList).toContain('govuk-table__cell--numeric');
  });

  it('should display sort buttons and emit event on click', () => {
    hostComponent.columns = [
      { header: 'One', field: 'first', isSortable: true },
      { header: 'Second', field: 'second', isSortable: true },
      { header: 'Third', field: 'third', isSortable: false },
    ];
    hostComponent.data = [
      { first: 1, second: new Date('2020-07-23T10:00:00Z'), third: 'abc' },
      { first: 2, second: new Date('2020-07-23T11:00:00Z'), third: 'cda' },
    ];

    fixture.detectChanges();
    const sortButtons = fixture.debugElement.queryAll(By.css('[aria-sort] button'));

    expect(sortButtons.length).toEqual(2);

    sortButtons[0].nativeElement.click();
    fixture.detectChanges();

    expect(hostComponent.onSort).toHaveBeenCalledWith({ column: 'first', direction: 'ascending' });
    expect(sortButtons[0].parent.attributes['aria-sort']).toBe('ascending');
    expect(sortButtons[1].parent.attributes['aria-sort']).toBe('none');

    sortButtons[0].nativeElement.click();
    fixture.detectChanges();

    expect(hostComponent.onSort).toHaveBeenCalledWith({ column: 'first', direction: 'descending' });
    expect(sortButtons[0].parent.attributes['aria-sort']).toBe('descending');
    expect(sortButtons[1].parent.attributes['aria-sort']).toBe('none');

    sortButtons[1].nativeElement.click();
    fixture.detectChanges();

    expect(hostComponent.onSort).toHaveBeenCalledWith({ column: 'second', direction: 'ascending' });
    expect(sortButtons[0].parent.attributes['aria-sort']).toBe('none');
    expect(sortButtons[1].parent.attributes['aria-sort']).toBe('ascending');
  });

  it('should set correct aria-label for sort buttons', () => {
    hostComponent.columns = [
      { header: 'Name', field: 'name', isSortable: true },
      { header: 'Age', field: 'age', isSortable: true },
    ];
    hostComponent.data = [
      { name: 'Alice', age: 30, surname: 'Smith' },
      { name: 'Bob', age: 24, surname: 'Johnson' },
    ];
    fixture.detectChanges();
    const nameSortButton = fixture.debugElement.query(By.css('th[aria-sort] button')).nativeElement;
    expect(nameSortButton.getAttribute('aria-label')).toContain('Sort by Name');

    nameSortButton.click();
    fixture.detectChanges();
    expect(nameSortButton.getAttribute('aria-label')).toContain('Name sorted in ascending order');

    nameSortButton.click();
    fixture.detectChanges();
    expect(nameSortButton.getAttribute('aria-label')).toContain('Name sorted in descending order');

  });

  it('should display custom template', () => {
    const templateFixture = TestBed.createComponent(TestTemplateComponent);
    templateFixture.componentInstance.data = [{ link: 'Go to', text: 'Something to watch' }];
    templateFixture.detectChanges();

    const element: HTMLElement = templateFixture.nativeElement;
    const anchors = element.querySelectorAll('a');

    expect(anchors.length).toEqual(1);
    expect(anchors[0].textContent).toEqual('Go to');
  });
});
