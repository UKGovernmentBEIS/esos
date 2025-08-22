import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { MoreLessComponent } from './more-less.component';

describe('MoreOrLessComponent', () => {
  let component: MoreLessComponent;
  let fixture: ComponentFixture<TestComponent>;
  let hostComponent: TestComponent;
  let element: HTMLElement;

  @Component({
    template:
      '<esos-more-less-text [text]="text" [index]="index" widthClass="org-details-width"></esos-more-less-text>',
    styles: [
      `
        .org-details-width {
          width: 210px !important;
        }
      `,
    ],
    standalone: true,
    imports: [MoreLessComponent],
  })
  class TestComponent {
    text: string;
    index: number;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(MoreLessComponent)).componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the right text', () => {
    hostComponent.text = 'Organisation name';
    fixture.detectChanges();

    expect(element.querySelector('div').textContent.trim()).toEqual('Organisation name');
  });

  it('should implement the right id to div', () => {
    expect(element.querySelector('#more-less-text-1')).toBeNull();

    hostComponent.index = 1;
    fixture.detectChanges();

    expect(element.querySelector('#more-less-text-1')).toBeTruthy();
  });
});
