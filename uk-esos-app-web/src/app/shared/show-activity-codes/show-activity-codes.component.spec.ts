import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { ShowActivityCodesComponent } from '@shared/show-activity-codes/show-activity-codes.component';

import { ClassificationCodes } from 'esos-api';

describe('ShowCodesComponent', () => {
  let component: ShowActivityCodesComponent;
  let fixture: ComponentFixture<TestComponent>;
  let hostComponent: TestComponent;
  let element: HTMLElement;

  @Component({
    template:
      '<esos-show-activity-codes [classificationCodes]="classificationCodes" [sameAsRU]="sameAsRU" [itemIndex]="0"></esos-show-activity-codes>',
    standalone: true,
    imports: [ShowActivityCodesComponent],
  })
  class TestComponent {
    classificationCodes = {
      type: 'SIC',
      codes: ['111111'],
    } as ClassificationCodes;
    sameAsRU = false;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(ShowActivityCodesComponent)).componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the content', () => {
    expect(element.querySelector('.govuk-accordion-nav__chevron--down')).toBeTruthy;
    expect(element.querySelector('.govuk-accordion__show-all-text').textContent.trim()).toEqual(
      'Show activity codes',
    );

    element.querySelector('button').click();
    fixture.detectChanges();

    expect(element.querySelector('.govuk-accordion-nav__chevron--down')).toBeFalsy;
    expect(element.querySelector('.govuk-accordion__show-all-text').textContent.trim()).toEqual(
      'Hide activity codes',
    );

    expect(element.querySelector('.govuk-accordion__section-content').textContent.trim()).toEqual('SIC:  111111');

    hostComponent.sameAsRU = true;
    hostComponent.classificationCodes = null;
    fixture.detectChanges();

    expect(element.querySelector('.govuk-accordion__section-content').textContent.trim()).toEqual("Same as the RU's");
  });
});
