import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SharedModule } from '@shared/shared.module';

import { ResponsibilityTypesComponent } from './responsibility-types.component';

describe('ResponsibilityTypesComponent', () => {
  let component: ResponsibilityTypesComponent;
  let fixture: ComponentFixture<TestComponent>;

  @Component({
    template: `
      <form id="responsibilityAssessmentTypes-group" [formGroup]="form">
        <esos-responsibility-types controlName="responsibilityAssessmentTypes"></esos-responsibility-types>
      </form>
    `,
  })
  class TestComponent {
    form = new FormGroup({
      responsibilityAssessmentTypes: new FormControl([
        'SATISFIED_WITH_INFORMATION_PROVIDED',
        'SATISFIED_WITH_ORGANISATION_COMPLIANT_WITH_SCOPE_OF_THE_SCHEME',
        'SATISFIED_WITH_INFORMATION_PROVIDED_UNLESS_THERE_IS_A_DECLARED_REASON',
        'SATISFIED_WITH_ORGANISATION_WITHIN_SCOPE_OF_THE_SCHEME',
      ]),
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [TestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.debugElement.query(By.directive(ResponsibilityTypesComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
