import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { ContactPerson, OperatorUserRegistrationDTO } from 'esos-api';

import { ContactPersonWithoutEmailDTO } from '../summaries';
import { UserInputSummaryTemplateComponent } from './user-input-summary.component';

describe('SummaryTemplateComponent', () => {
  let component: UserInputSummaryTemplateComponent;
  let fixture: ComponentFixture<TestComponent>;
  let hostComponent: TestComponent;

  const mockUserOperatorDTO: OperatorUserRegistrationDTO = {
    firstName: 'John',
    lastName: 'Doe',
    jobTitle: 'job title',
    address: {
      line1: 'Line 1',
      city: 'City',
      county: 'County',
      postcode: 'PostCode',
    },
    phoneNumber: {
      countryCode: 'UK44',
      number: '123',
    },
  };

  const email = 'test@email.com';
  const contactPersonDTO: ContactPersonWithoutEmailDTO = {
    firstName: 'John',
    lastName: 'Doe',
    jobTitle: 'job title',
    address: {
      line1: 'Line 1',
      city: 'City',
      county: 'County',
      postcode: 'PostCode',
    },
    phoneNumber: {
      countryCode: 'UK44',
      number: '123',
    },
  };

  @Component({
    template:
      '<esos-user-input-summary-template [userInfo]="userInfo" [userEmail]="userEmail" [changeLink]="changeLink" [canChangeEmail]="canChangeEmail"></esos-user-input-summary-template>',
    standalone: true,
    imports: [UserInputSummaryTemplateComponent],
  })
  class TestComponent {
    userInfo: OperatorUserRegistrationDTO | ContactPerson;
    userEmail: string;
    changeLink: string;
    canChangeEmail: boolean;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TestComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
    hostComponent = fixture.componentInstance;
    hostComponent.userInfo = mockUserOperatorDTO;
    hostComponent.userEmail = email;
    hostComponent.canChangeEmail = false;
    hostComponent.changeLink = '../';
    component = fixture.debugElement.query(By.directive(UserInputSummaryTemplateComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user details from registration correctly', async () => {
    hostComponent.userInfo = mockUserOperatorDTO;
    hostComponent.userEmail = email;
    hostComponent.canChangeEmail = false;
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement;

    expect(compiled.textContent).toContain('John');
    expect(compiled.textContent).toContain('Doe');
    expect(compiled.textContent).toContain('job title');
    expect(compiled.textContent).toContain('test@email.com');
    expect(compiled.textContent).toContain('Line 1');
    expect(compiled.textContent).toContain('City');
    expect(compiled.textContent).toContain('County');
    expect(compiled.textContent).toContain('PostCode');
    expect(compiled.textContent).toContain('UK44');
    expect(compiled.textContent).toContain('123');

    const emailActionsEl = Array.from(document.querySelectorAll('.govuk-summary-list__row'))
      .find((row) => row.querySelector('dt')?.textContent?.trim() === 'Email address')
      ?.querySelector('.govuk-summary-list__actions');
    expect(emailActionsEl).toBeNull();
  });

  it('should display user details from contactPersonDTO', async () => {
    hostComponent.userInfo = contactPersonDTO;
    hostComponent.userEmail = email;
    hostComponent.canChangeEmail = true;

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement;

    expect(compiled.textContent).toContain('John');
    expect(compiled.textContent).toContain('Doe');
    expect(compiled.textContent).toContain('job title');
    expect(compiled.textContent).toContain('test@email.com');
    expect(compiled.textContent).toContain('Line 1');
    expect(compiled.textContent).toContain('City');
    expect(compiled.textContent).toContain('County');
    expect(compiled.textContent).toContain('PostCode');
    expect(compiled.textContent).toContain('UK44');
    expect(compiled.textContent).toContain('123');

    const emailActionsEl = Array.from(document.querySelectorAll('.govuk-summary-list__row'))
      .find((row) => row.querySelector('dt')?.textContent?.trim() === 'Email address')
      ?.querySelector('.govuk-summary-list__actions');
    expect(emailActionsEl).toBeDefined();
  });
});
