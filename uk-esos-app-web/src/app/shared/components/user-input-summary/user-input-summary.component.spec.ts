import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { ContactPerson, OperatorUserDTO } from 'esos-api';

import { UserInputSummaryTemplateComponent } from './user-input-summary.component';

describe('SummaryTemplateComponent', () => {
  let component: UserInputSummaryTemplateComponent;
  let fixture: ComponentFixture<TestComponent>;
  let hostComponent: TestComponent;

  const mockUserOperatorDTO: OperatorUserDTO = {
    firstName: 'John',
    lastName: 'Doe',
    jobTitle: 'job title',
    email: 'test@email.com',
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
    template: '<esos-user-input-summary-template [userInfo]="userInfo"></esos-user-input-summary-template>',
    standalone: true,
    imports: [UserInputSummaryTemplateComponent],
  })
  class TestComponent {
    userInfo: OperatorUserDTO | ContactPerson;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TestComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
    hostComponent = fixture.componentInstance;
    hostComponent.userInfo = mockUserOperatorDTO;
    component = fixture.debugElement.query(By.directive(UserInputSummaryTemplateComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user details from registration correctly', async () => {
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
  });

  it('should display user details from noc correctly', async () => {
    const { address, ...newMockUserOperatorDTO } = mockUserOperatorDTO;

    hostComponent.userInfo = { ...newMockUserOperatorDTO, ...address };

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
  });
});
